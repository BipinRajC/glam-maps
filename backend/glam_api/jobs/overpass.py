from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional

import httpx
from sqlalchemy import delete

from glam_api.db.models import RoadFeature
from glam_api.db.session import async_session

logger = logging.getLogger(__name__)

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

OVERPASS_QUERY = """
[out:json][timeout:60];
(
  node["traffic_calming"="bump"]({s},{w},{n},{e});
  node["traffic_calming"="hump"]({s},{w},{n},{e});
  node["highway"="construction"]({s},{w},{n},{e});
  way["bridge"="yes"]["highway"]({s},{w},{n},{e});
);
out center;
"""

# Bengaluru bounding box
BBOX = {"s": 12.85, "w": 77.47, "n": 13.07, "e": 77.75}

TAG_TO_TYPE = {
    "bump": "bump",
    "hump": "hump",
}


def _classify(element: dict) -> Optional[str]:
    tags = element.get("tags", {})
    calming = tags.get("traffic_calming")
    if calming in TAG_TO_TYPE:
        return TAG_TO_TYPE[calming]
    if tags.get("highway") == "construction":
        return "construction"
    if tags.get("bridge") == "yes":
        return "flyover"
    return None


async def run_overpass() -> None:
    query = OVERPASS_QUERY.format(**BBOX)

    async with httpx.AsyncClient(timeout=90) as http:
        resp = await http.post(OVERPASS_URL, data={"data": query})
        resp.raise_for_status()
        data = resp.json()

    elements = data.get("elements", [])
    logger.info(f"Overpass returned {len(elements)} elements")

    async with async_session() as db:
        await db.execute(delete(RoadFeature).where(RoadFeature.city == "bengaluru"))

        inserted = 0
        for el in elements:
            feature_type = _classify(el)
            if not feature_type:
                continue
            lat = el.get("lat") or el.get("center", {}).get("lat")
            lon = el.get("lon") or el.get("center", {}).get("lon")
            if lat is None or lon is None:
                continue

            db.add(RoadFeature(
                city="bengaluru",
                feature_type=feature_type,
                geom=f"SRID=4326;POINT({lon} {lat})",
                osm_id=el.get("id"),
                name=el.get("tags", {}).get("name"),
                fetched_at=datetime.now(timezone.utc),
            ))
            inserted += 1

        await db.commit()
        logger.info(f"Overpass fetch complete: {inserted} features stored")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_overpass())
