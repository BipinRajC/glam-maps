from __future__ import annotations

from typing import Dict, List, Optional

import polyline as polyline_codec
from geoalchemy2.shape import to_shape
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from glam_api.db.models import Route


class PrecomputedRouteProvider:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_routes(self, city: str) -> List[Route]:
        result = await self.db.execute(
            select(Route).where(Route.city == city).order_by(Route.name)
        )
        return list(result.scalars())

    async def get_route_bundle(self, route_id: str) -> Optional[Dict]:
        result = await self.db.execute(
            select(Route)
            .options(selectinload(Route.zones))
            .where(Route.id == route_id)
        )
        route = result.scalar_one_or_none()
        if not route:
            return None

        shape = to_shape(route.polyline)
        encoded = polyline_codec.encode([(c[1], c[0]) for c in shape.coords])

        zones = sorted(route.zones, key=lambda z: z.seq)
        zone_dicts = []
        smooth_stretches = []

        for i, z in enumerate(zones):
            alert_shape = to_shape(z.alert_point)
            zone_dicts.append({
                "seq": z.seq,
                "startDistM": z.start_dist_m,
                "endDistM": z.end_dist_m,
                "alertPoint": {"lat": alert_shape.y, "lng": alert_shape.x},
                "potholeCount": z.pothole_count,
                "intensity": z.intensity,
                "label": z.label,
                "copy": z.copy,
                "representativePhotoUrl": None,
            })
            if i > 0:
                gap = z.start_dist_m - zones[i - 1].end_dist_m
                if gap >= 500:
                    smooth_stretches.append({
                        "afterZoneSeq": zones[i - 1].seq,
                        "startDistM": zones[i - 1].end_dist_m,
                        "endDistM": z.start_dist_m,
                    })

        worst_zone_score = 100
        if zones:
            worst = max(zones, key=lambda z: z.pothole_count)
            from glam_api.scoring.glam_score import compute_glam_score
            worst_zone_score = compute_glam_score(
                worst.pothole_count, worst.end_dist_m - worst.start_dist_m or 1, 10.0
            )

        longest_smooth = max(
            (s["endDistM"] - s["startDistM"] for s in smooth_stretches), default=0
        )

        from glam_api.scoring.glam_score import compute_sub_metrics
        sub_metrics = compute_sub_metrics(
            glam_score=route.glam_score or 0,
            worst_zone_score=worst_zone_score,
            longest_smooth_m=longest_smooth,
            total_distance_m=route.distance_m,
        )

        return {
            "id": route.id,
            "name": route.name,
            "distanceM": route.distance_m,
            "polyline": encoded,
            "glamScore": route.glam_score,
            "scoreBand": route.score_band,
            "subMetrics": sub_metrics,
            "zones": zone_dicts,
            "smoothStretches": smooth_stretches,
        }
