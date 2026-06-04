from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, List, Tuple

from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from sqlalchemy import and_, delete, func, select

from glam_api.db.models import GlamRiskZone, Pothole, Route, ZonePothole
from glam_api.db.session import async_session
from glam_api.geo.helpers import gap_cluster, interpolate_point_on_line, locate_point_on_line
from glam_api.scoring.glam_score import (
    classify_intensity,
    compute_glam_score,
    get_score_band,
    load_copy_templates,
)

logger = logging.getLogger(__name__)

SCORING_BUFFER_M = 15
ZONE_GAP_M = 100
SMOOTH_STRETCH_M = 500

ZONE_LABELS = {
    "heavy": "Smudge Zone",
    "moderate": "Caution Zone",
    "minor": "Minor Zone",
}


async def _precompute_route(db, route: Route, copy_templates: dict) -> Tuple[int, List[GlamRiskZone]]:
    route_shape = to_shape(route.polyline)

    result = await db.execute(
        select(Pothole).where(
            and_(
                Pothole.city == route.city,
                func.ST_DWithin(Pothole.geom, route.polyline, SCORING_BUFFER_M),
            )
        )
    )
    candidates = result.scalars().all()

    # Project each pothole onto the route (1-D linear referencing)
    pothole_dists: List[Tuple[float, Pothole]] = []
    for p in candidates:
        p_shape = to_shape(p.geom)
        frac = locate_point_on_line(route_shape, p_shape)
        dist_m = frac * route.distance_m
        pothole_dists.append((dist_m, p))

    pothole_dists.sort(key=lambda x: x[0])
    distances_only = [d for d, _ in pothole_dists]
    clusters = gap_cluster(distances_only, ZONE_GAP_M)

    # Clear existing zones for this route
    await db.execute(delete(GlamRiskZone).where(GlamRiskZone.route_id == route.id))

    zones: List[GlamRiskZone] = []
    p_idx = 0

    for seq, cluster_dists in enumerate(clusters, 1):
        count = len(cluster_dists)
        start_dist = int(cluster_dists[0])
        end_dist = int(cluster_dists[-1])
        intensity = classify_intensity(count)

        start_frac = start_dist / route.distance_m if route.distance_m > 0 else 0
        alert_pt = interpolate_point_on_line(route_shape, start_frac)

        copy_options = copy_templates.get("zone", {}).get(intensity, ["Alert in {dist}m"])
        copy_text = copy_options[0]

        rep_pothole = pothole_dists[p_idx][1] if pothole_dists else None

        zone = GlamRiskZone(
            route_id=route.id,
            city=route.city,
            seq=seq,
            start_dist_m=start_dist,
            end_dist_m=end_dist,
            alert_point=f"SRID=4326;POINT({alert_pt.x} {alert_pt.y})",
            pothole_count=count,
            intensity=intensity,
            rep_pothole_id=rep_pothole.id if rep_pothole else None,
            label=ZONE_LABELS[intensity],
            copy=copy_text,
        )
        db.add(zone)
        zones.append(zone)
        p_idx += count

    await db.flush()

    # Populate zone_potholes join table
    p_idx = 0
    for zone in zones:
        for _ in range(zone.pothole_count):
            if p_idx < len(pothole_dists):
                db.add(ZonePothole(zone_id=zone.id, pothole_id=pothole_dists[p_idx][1].id))
                p_idx += 1

    return len(candidates), zones


async def run_precompute() -> None:
    copy_templates = load_copy_templates()

    async with async_session() as db:
        result = await db.execute(select(Route))
        routes = result.scalars().all()

        if not routes:
            logger.warning("No routes in DB — run precompute after inserting routes")
            return

        # First pass: collect densities to compute D_MAX
        all_densities: List[float] = []
        route_counts: Dict[str, int] = {}

        for route in routes:
            result = await db.execute(
                select(func.count(Pothole.id)).where(
                    and_(
                        Pothole.city == route.city,
                        func.ST_DWithin(Pothole.geom, route.polyline, SCORING_BUFFER_M),
                    )
                )
            )
            n = result.scalar() or 0
            route_counts[route.id] = n
            if route.distance_m > 0:
                all_densities.append(n / (route.distance_m / 1000))

        # D_MAX = 90th-percentile density, floor at 1.0 to avoid div-by-zero
        if all_densities:
            sorted_d = sorted(all_densities)
            d_max = sorted_d[int(len(sorted_d) * 0.9)]
            d_max = max(d_max, 1.0)
        else:
            d_max = 10.0

        logger.info(f"D_MAX = {d_max:.2f} (from {len(all_densities)} routes)")

        # Second pass: cluster zones and score each route
        for route in routes:
            n, zones = await _precompute_route(db, route, copy_templates)
            route.glam_score = compute_glam_score(n, route.distance_m, d_max)
            route.score_band = get_score_band(route.glam_score)
            route.computed_at = datetime.now(timezone.utc)
            logger.info(
                f"Route {route.id}: {n} potholes, {len(zones)} zones, score={route.glam_score}"
            )

        await db.commit()
        logger.info(f"Precompute complete: {len(routes)} routes processed")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_precompute())
