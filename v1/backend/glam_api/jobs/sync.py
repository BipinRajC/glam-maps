import asyncio
import logging
from datetime import datetime, timezone

import httpx
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert

from glam_api.db.models import Pothole, SyncRun
from glam_api.db.session import async_session
from glam_api.settings import settings

logger = logging.getLogger(__name__)

ACTIVE_STATUSES = {"reported", "verified"}


def transform_record(raw: dict) -> dict:
    return {
        "complaint_id": raw["complaintId"],
        "source_id": raw.get("_id"),
        "lat": float(raw["latitude"]),
        "lng": float(raw["longitude"]),
        "status": raw.get("status", "reported"),
        "image_url": raw.get("imageUrl"),
        "evidence_url": raw.get("evidenceUrl"),
        "report_count": raw.get("reportCount", 1),
        "language": raw.get("language"),
        "reported_at": datetime.fromtimestamp(int(raw["timestamp"]), tz=timezone.utc),
    }


async def run_sync() -> None:
    async with async_session() as db:
        run = SyncRun()
        db.add(run)
        await db.flush()

        try:
            async with httpx.AsyncClient(timeout=60) as http:
                resp = await http.get(
                    f"{settings.nammapothole_api_base}/potholes",
                    headers={"Authorization": f"Bearer {settings.nammapothole_api_token}"},
                )
                resp.raise_for_status()
                records = resp.json()

            run.fetched_count = len(records)
            upstream_ids: set[str] = set()
            upserted = 0

            for raw in records:
                t = transform_record(raw)
                upstream_ids.add(str(t["complaint_id"]))

                stmt = (
                    insert(Pothole)
                    .values(
                        complaint_id=t["complaint_id"],
                        source_id=t["source_id"],
                        city="bengaluru",
                        geom=f"SRID=4326;POINT({t['lng']} {t['lat']})",
                        status=t["status"],
                        image_url=t["image_url"],
                        evidence_url=t["evidence_url"],
                        report_count=t["report_count"],
                        language=t["language"],
                        reported_at=t["reported_at"],
                    )
                    .on_conflict_do_update(
                        index_elements=["complaint_id"],
                        set_={
                            "status": t["status"],
                            "image_url": t["image_url"],
                            "synced_at": datetime.now(timezone.utc),
                        },
                    )
                )
                await db.execute(stmt)
                upserted += 1

            # Prune rows that vanished upstream (handles upstream DELETEs)
            result = await db.execute(select(Pothole.complaint_id))
            existing = {str(row[0]) for row in result}
            to_prune = existing - upstream_ids
            if to_prune:
                await db.execute(
                    delete(Pothole).where(Pothole.complaint_id.in_(list(to_prune)))
                )

            run.upserted_count = upserted
            run.pruned_count = len(to_prune)
            run.status = "ok"
            run.finished_at = datetime.now(timezone.utc)
            await db.commit()
            logger.info(f"Sync complete: {upserted} upserted, {len(to_prune)} pruned")

        except Exception as e:
            run.status = "failed"
            run.error = str(e)
            run.finished_at = datetime.now(timezone.utc)
            await db.commit()
            raise


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_sync())
