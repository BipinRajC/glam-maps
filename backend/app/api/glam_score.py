from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Route
from app.schemas.schemas import GlamScoreResponse
from app.services.potholes import count_potholes_on_route

router = APIRouter()

# ---------------------------------------------------------------------------
# In-memory score cache (30-minute TTL)
# ---------------------------------------------------------------------------

_score_cache: dict = {}  # { route_id: (GlamScoreResponse, computed_at) }
_CACHE_TTL = timedelta(minutes=30)


def _get_cached_score(route_id: int) -> GlamScoreResponse | None:
    if route_id in _score_cache:
        response, computed_at = _score_cache[route_id]
        if datetime.now(timezone.utc) - computed_at < _CACHE_TTL:
            return response
    return None


def _set_cached_score(route_id: int, response: GlamScoreResponse) -> None:
    _score_cache[route_id] = (response, datetime.now(timezone.utc))


def _calculate_pothole_penalty(
    pothole_count: int, distance_meters: int | None
) -> float:
    if not distance_meters:
        return 0.0
    route_length_km = distance_meters / 1000.0
    density = pothole_count / route_length_km  # potholes per km
    # 0/km -> 0 penalty; 5/km -> 20; 10+/km -> 40 (capped)
    return round(min(density * 4, 40.0), 2)


# ---------------------------------------------------------------------------
# Road type penalty (max 25 points) — PoC hardcode
# ---------------------------------------------------------------------------

ROAD_TYPE_PENALTIES = {
    'motorway': 0,
    'trunk': 2,
    'primary': 5,
    'secondary': 10,
    'tertiary': 16,
    'residential': 20,
    'unclassified': 23,
    'service': 25,
}


def _get_road_type_for_route() -> str:
    # TODO: derive from OSM data along the route geometry
    return 'secondary'


def _calculate_road_penalty(osm_highway_type: str) -> float:
    return float(ROAD_TYPE_PENALTIES.get(osm_highway_type, 15))


# ---------------------------------------------------------------------------
# Route handler
# ---------------------------------------------------------------------------


@router.get('/glam-score/{route_id}', response_model=GlamScoreResponse)
async def get_glam_score(
    route_id: int, db: AsyncSession = Depends(get_db)
) -> GlamScoreResponse:
    """Return a Glam Score (1-100) indicating how makeup-friendly a route is."""
    cached = _get_cached_score(route_id)
    if cached:
        return cached

    route = await db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail='Route not found')

    pothole_count = await count_potholes_on_route(route_id, db)
    pothole_penalty = _calculate_pothole_penalty(pothole_count, route.distance_meters)

    # TODO: implement traffic penalty once Route model has duration columns
    traffic_penalty = 0.0

    road_type = _get_road_type_for_route()
    road_penalty = _calculate_road_penalty(road_type)

    raw_score = 100 - pothole_penalty - traffic_penalty - road_penalty
    final_score = max(1, min(100, round(raw_score)))

    response = GlamScoreResponse(
        score=final_score,
        pothole_penalty=pothole_penalty,
        traffic_penalty=traffic_penalty,
        road_penalty=road_penalty,
    )
    _set_cached_score(route_id, response)
    return response
