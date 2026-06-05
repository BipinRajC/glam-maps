import polyline as polyline_codec
from fastapi import APIRouter, Depends, HTTPException
from geoalchemy2 import WKTElement
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.logger import logger
from app.models.models import Route, Waypoint
from app.schemas.schemas import RouteRequest, RouteResponse
from app.services.routing import compute_route

router = APIRouter()


@router.post('/route', response_model=RouteResponse)
async def generate_route(body: RouteRequest, db: AsyncSession = Depends(get_db)):
    """Generate or retrieve a cached route between two waypoints."""

    # 1. Validate that both waypoints exist
    start_wp = await db.get(Waypoint, body.start_waypoint_id)
    end_wp = await db.get(Waypoint, body.end_waypoint_id)

    if start_wp is None or end_wp is None:
        missing = []
        if start_wp is None:
            missing.append(body.start_waypoint_id)
        if end_wp is None:
            missing.append(body.end_waypoint_id)
        raise HTTPException(
            status_code=404,
            detail=f'Waypoint(s) not found: {missing}',
        )

    # 2. Check for a cached route (same start + end pair)
    result = await db.execute(
        select(Route).filter_by(
            start_waypoint_id=body.start_waypoint_id,
            end_waypoint_id=body.end_waypoint_id,
        )
    )
    cached = result.scalars().first()
    if cached is not None:
        logger.info(f'Cache hit for route {cached.id}')
        return RouteResponse(
            route_id=cached.id,
            encoded_polyline=cached.encoded_polyline,
        )

    # 3. Extract lat/lng from waypoint geometries
    start_lat, start_lng = await _extract_lat_lng(db, start_wp)
    end_lat, end_lng = await _extract_lat_lng(db, end_wp)

    # 4. Call Google Maps Routes API
    try:
        route_data = await compute_route(start_lat, start_lng, end_lat, end_lng)
    except Exception as exc:
        logger.error(f'Google Routes API error: {exc}')
        raise HTTPException(
            status_code=502,
            detail='Error communicating with the Google Maps API.',
        ) from exc

    # 5. Decode polyline → LINESTRING WKT for the geom column
    encoded = route_data['encoded_polyline']
    coords = polyline_codec.decode(encoded)  # list of (lat, lng) tuples
    wkt_coords = ', '.join(f'{lng} {lat}' for lat, lng in coords)
    line_wkt = f'LINESTRING({wkt_coords})'

    # 6. Persist to DB
    route = Route(
        start_waypoint_id=body.start_waypoint_id,
        end_waypoint_id=body.end_waypoint_id,
        encoded_polyline=encoded,
        geom=WKTElement(line_wkt, srid=4326),
        distance_meters=route_data.get('distance_meters'),
    )
    db.add(route)
    await db.commit()
    await db.refresh(route)

    logger.info(f'Created route {route.id}')
    return RouteResponse(route_id=route.id, encoded_polyline=route.encoded_polyline)


async def _extract_lat_lng(db: AsyncSession, wp: Waypoint) -> tuple[float, float]:
    """Extract (lat, lng) from a Waypoint's PostGIS geometry."""
    result = await db.execute(
        select(
            ST_Y(wp.geom).label('lat'),
            ST_X(wp.geom).label('lng'),
        )
    )
    row = result.one()
    return float(row.lat), float(row.lng)
