import numpy as np
from fastapi import APIRouter, Depends
from geoalchemy2.functions import (
    ST_X,
    ST_Y,
    ST_LineInterpolatePoint,
)
from sklearn.cluster import KMeans
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Route
from app.schemas.schemas import CheckpointResponse
from app.services.messages import pick_message
from app.services.potholes import get_potholes_along_route

router = APIRouter()


@router.get('/checkpoints/{route_id}', response_model=list[CheckpointResponse])
async def get_checkpoints(
    route_id: int, db: AsyncSession = Depends(get_db)
) -> list[CheckpointResponse]:
    """Return 3-4 checkpoints along a route, clustering nearby potholes."""
    rows = await get_potholes_along_route(route_id, db)
    pothole_cps = _cluster_potholes(rows, n_clusters=3)
    all_cps = _fill_smooth_stretches(pothole_cps, total_needed=4)

    # Resolve lat/lng for smooth stretch checkpoints via PostGIS
    all_cps = await _resolve_smooth_stretch_coords(all_cps, route_id, db)

    result = []
    for i, cp in enumerate(all_cps):
        result.append(
            CheckpointResponse(
                id=f'chk_{route_id}_{i}',
                lat=cp['lat'],
                lng=cp['lng'],
                image_url=cp['image_url'],
                message=pick_message(cp['pothole_count']),
                is_smooth_stretch=cp['is_smooth_stretch'],
            )
        )
    return result


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
                'image_url': most_recent.Pothole.image_url,
                'pothole_count': len(members),
                'is_smooth_stretch': False,
            }
        )

    return sorted(checkpoints, key=lambda c: c['t'])


def _fill_smooth_stretches(
    pothole_checkpoints: list[dict], total_needed: int = 4
) -> list[dict]:
    """Pad with smooth-stretch markers until total_needed checkpoints exist."""
    all_cps = list(pothole_checkpoints)
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
                'image_url': None,
                'pothole_count': 0,
                'is_smooth_stretch': True,
            }
        )

    return sorted(all_cps, key=lambda c: c['t'])


async def _resolve_smooth_stretch_coords(
    checkpoints: list[dict], route_id: int, db: AsyncSession
) -> list[dict]:
    """Compute real lat/lng for smooth-stretch checkpoints via ST_LineInterpolatePoint."""
    smooth = [cp for cp in checkpoints if cp['is_smooth_stretch']]
    if not smooth:
        return checkpoints

    route_geom = select(Route.geom).filter(Route.id == route_id).scalar_subquery()

    for cp in smooth:
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
