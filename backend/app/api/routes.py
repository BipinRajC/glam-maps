import numpy as np
import polyline as polyline_codec
from fastapi import APIRouter, Depends, HTTPException
from geoalchemy2 import WKTElement
from geoalchemy2.functions import ST_X, ST_Y, ST_LineInterpolatePoint
from sklearn.cluster import KMeans
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.logger import logger
from app.models.models import Route
from app.schemas.schemas import CheckpointResponse, RouteRequest, RouteResponse
from app.services.messages import pick_message
from app.services.potholes import get_potholes_along_route
from app.services.routing import compute_route

router = APIRouter()


@router.post('/route', response_model=RouteResponse)
async def generate_route(body: RouteRequest, db: AsyncSession = Depends(get_db)):
    """Generate or retrieve a cached route, then return it with checkpoints."""

    # 1. Check for a cached route (same start + end coordinates)
    result = await db.execute(
        select(Route).filter_by(
            start_lat=body.start_lat,
            start_lng=body.start_lng,
            end_lat=body.end_lat,
            end_lng=body.end_lng,
        )
    )
    cached = result.scalars().first()

    if cached is not None:
        logger.info(f'Cache hit for route {cached.id}')
        route = cached
    else:
        # 2. Call Google Maps Routes API
        try:
            route_data = await compute_route(
                body.start_lat, body.start_lng, body.end_lat, body.end_lng
            )
        except Exception as exc:
            logger.error(f'Google Routes API error: {exc}')
            raise HTTPException(
                status_code=502,
                detail='Error communicating with the Google Maps API.',
            ) from exc

        # 3. Decode polyline → LINESTRING WKT for the geom column
        encoded = route_data['encoded_polyline']
        coords = polyline_codec.decode(encoded)  # list of (lat, lng) tuples
        wkt_coords = ', '.join(f'{lng} {lat}' for lat, lng in coords)
        line_wkt = f'LINESTRING({wkt_coords})'

        # 4. Persist to DB (including speed intervals for cached traffic data)
        route = Route(
            start_lat=body.start_lat,
            start_lng=body.start_lng,
            end_lat=body.end_lat,
            end_lng=body.end_lng,
            encoded_polyline=encoded,
            geom=WKTElement(line_wkt, srid=4326),
            distance_meters=route_data.get('distance_meters'),
            speed_intervals=route_data.get('speed_intervals'),
        )
        db.add(route)
        await db.commit()
        await db.refresh(route)
        logger.info(f'Created route {route.id}')

    # 5. Generate checkpoints along the route
    checkpoints = await _build_checkpoints(route, db)

    return RouteResponse(
        route_id=route.id,
        encoded_polyline=route.encoded_polyline,
        checkpoints=checkpoints,
    )


# ---------------------------------------------------------------------------
# Checkpoint builders
# ---------------------------------------------------------------------------


async def _build_checkpoints(
    route: Route, db: AsyncSession
) -> list[CheckpointResponse]:
    """Build merged checkpoint list: pothole clusters + traffic segments."""

    route_id = route.id

    # --- Pothole checkpoints ---
    rows = await get_potholes_along_route(route_id, db)
    pothole_cps = _cluster_potholes(rows, n_clusters=5)

    # --- Traffic checkpoints ---
    traffic_cps = _build_traffic_checkpoints(route)

    # --- Merge all checkpoints, sorted by fractional position ---
    all_cps = pothole_cps + traffic_cps
    all_cps.sort(key=lambda c: c['t'])

    # If no potholes or traffic data, fill with smooth stretches
    if not all_cps:
        all_cps = _fill_smooth_stretches([], total_needed=4)

    # Resolve lat/lng for any checkpoints that need PostGIS interpolation
    all_cps = await _resolve_interpolated_coords(all_cps, route_id, db)

    return [
        CheckpointResponse(
            id=f'chk_{route_id}_{i}',
            lat=cp['lat'],
            lng=cp['lng'],
            checkpoint_type=cp['checkpoint_type'],
            image_url=cp.get('image_url'),
            message=pick_message(
                pothole_count=cp.get('pothole_count', 0),
                traffic_speed=cp.get('traffic_speed'),
            ),
            traffic_speed=cp.get('traffic_speed'),
            pothole_count=cp.get('pothole_count', 0),
        )
        for i, cp in enumerate(all_cps)
    ]


# ---------------------------------------------------------------------------
# Traffic checkpoints — from Google speedReadingIntervals
# ---------------------------------------------------------------------------


def _build_traffic_checkpoints(route: Route) -> list[dict]:
    """Create a checkpoint at the midpoint of each traffic speed segment."""
    intervals = route.speed_intervals or []
    if not intervals:
        return []

    coords = polyline_codec.decode(route.encoded_polyline)
    total_points = len(coords)
    if total_points == 0:
        return []

    checkpoints = []
    for seg in intervals:
        start_idx = seg.get('startPolylinePointIndex', 0)
        end_idx = seg.get('endPolylinePointIndex', 0)
        speed = seg.get('speed', 'NORMAL')

        mid_idx = (start_idx + end_idx) // 2
        mid_idx = min(mid_idx, total_points - 1)
        mid_lat, mid_lng = coords[mid_idx]

        # Fractional position along route (0.0 → 1.0)
        frac = mid_idx / max(total_points - 1, 1)

        checkpoints.append(
            {
                't': frac,
                'lat': mid_lat,
                'lng': mid_lng,
                'checkpoint_type': 'traffic',
                'traffic_speed': speed,
                'pothole_count': 0,
                'image_url': None,
                'needs_interpolation': False,
            }
        )

    return checkpoints


# ---------------------------------------------------------------------------
# Pothole checkpoints — KMeans clustering
# ---------------------------------------------------------------------------


def _cluster_potholes(rows: list, n_clusters: int = 3) -> list[dict]:
    """Cluster pothole rows by their fractional position along the route."""
    if not rows:
        return []

    k = min(n_clusters, len(rows))
    t_values = np.array([[row.frac] for row in rows])

    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(t_values)

    clusters: dict[int, list] = {}
    for row, label in zip(rows, kmeans.labels_):
        clusters.setdefault(int(label), []).append(row)

    checkpoints = []
    for members in clusters.values():
        t_center = float(np.mean([m.frac for m in members]))
        center_lat = float(np.mean([m.lat for m in members]))
        center_lng = float(np.mean([m.lng for m in members]))
        most_recent = max(members, key=lambda m: m.Pothole.reported_at)

        checkpoints.append(
            {
                't': t_center,
                'lat': center_lat,
                'lng': center_lng,
                'checkpoint_type': 'pothole',
                'image_url': most_recent.Pothole.image_url,
                'pothole_count': len(members),
                'traffic_speed': None,
                'needs_interpolation': False,
            }
        )

    return sorted(checkpoints, key=lambda c: c['t'])


# ---------------------------------------------------------------------------
# Smooth stretch filler (fallback when no data exists)
# ---------------------------------------------------------------------------


def _fill_smooth_stretches(
    existing_checkpoints: list[dict], total_needed: int = 4
) -> list[dict]:
    """Pad with smooth-stretch markers when no other checkpoints exist."""
    all_cps = list(existing_checkpoints)
    needed = total_needed - len(all_cps)

    if needed <= 0:
        return all_cps[:total_needed]

    occupied_t = sorted(c['t'] for c in all_cps)
    gaps: list[float] = []

    if not occupied_t or occupied_t[0] > 0.15:
        gaps.append(0.15)

    for i in range(len(occupied_t) - 1):
        if occupied_t[i + 1] - occupied_t[i] > 0.25:
            gaps.append((occupied_t[i] + occupied_t[i + 1]) / 2)

    if not occupied_t or occupied_t[-1] < 0.85:
        gaps.append(0.85)

    for t in gaps[:needed]:
        all_cps.append(
            {
                't': t,
                'lat': None,
                'lng': None,
                'checkpoint_type': 'smooth',
                'image_url': None,
                'pothole_count': 0,
                'traffic_speed': None,
                'needs_interpolation': True,
            }
        )

    return sorted(all_cps, key=lambda c: c['t'])


# ---------------------------------------------------------------------------
# PostGIS coordinate resolution for checkpoints that need it
# ---------------------------------------------------------------------------


async def _resolve_interpolated_coords(
    checkpoints: list[dict], route_id: int, db: AsyncSession
) -> list[dict]:
    """Compute real lat/lng for checkpoints that need PostGIS interpolation."""
    needs_resolve = [cp for cp in checkpoints if cp.get('needs_interpolation')]
    if not needs_resolve:
        return checkpoints

    route_geom = select(Route.geom).filter(Route.id == route_id).scalar_subquery()

    for cp in needs_resolve:
        point_expr = ST_LineInterpolatePoint(route_geom, cp['t'])
        result = await db.execute(
            select(
                ST_Y(point_expr).label('lat'),
                ST_X(point_expr).label('lng'),
            )
        )
        row = result.one()
        cp['lat'] = float(row.lat)
        cp['lng'] = float(row.lng)

    return checkpoints
