"""
Seed script: populate the waypoints table with Bengaluru transit nodes.

Deduplication is done on the waypoint name (case-sensitive).
Existing rows are left untouched (skipped).

Run from the backend/ directory:
    uv run python seed/seed_waypoints.py
"""

import asyncio
import sys
from pathlib import Path

from geoalchemy2 import WKTElement
from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

# ---------------------------------------------------------------------------
# Resolve DATABASE_URL the same way the app does (reads .env if present)
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings  # noqa: E402
from app.models.models import Base, Waypoint  # noqa: E402

BENGALURU_WAYPOINTS = [
    # --- East Zone 1 & 2 (High Density Nodes) ---
    {'name': 'Indiranagar 100ft Road', 'lat': 12.9784, 'lng': 77.6408},
    {'name': 'Domlur Junction', 'lat': 12.9610, 'lng': 77.6387},
    {'name': 'Ulsoor Lake', 'lat': 12.9818, 'lng': 77.6180},
    {'name': 'CV Raman Nagar', 'lat': 12.9859, 'lng': 77.6644},
    {'name': 'KR Puram Railway Station', 'lat': 13.0016, 'lng': 77.6745},
    {'name': 'Mahadevapura', 'lat': 12.9961, 'lng': 77.6955},
    {'name': 'Marathahalli Bridge', 'lat': 12.9560, 'lng': 77.7011},
    {'name': 'Bellandur (ORR)', 'lat': 12.9304, 'lng': 77.6784},
    {'name': 'Whitefield (Hope Farm)', 'lat': 12.9845, 'lng': 77.7500},
    {'name': 'Kadugodi', 'lat': 12.9984, 'lng': 77.7610},
    {'name': 'Kundalahalli Gate', 'lat': 12.9548, 'lng': 77.7139},
    {'name': 'Frazer Town', 'lat': 12.9985, 'lng': 77.6133},
    # --- South Zone 1 & 2 (High Density Nodes) ---
    {'name': 'Jayanagar 4th Block', 'lat': 12.9298, 'lng': 77.5815},
    {'name': 'JP Nagar (Delmia Circle)', 'lat': 12.9063, 'lng': 77.5857},
    {'name': 'Banashankari TTMC', 'lat': 12.9175, 'lng': 77.5732},
    {'name': 'BTM Layout (Udupi Garden)', 'lat': 12.9166, 'lng': 77.6101},
    {'name': 'HSR Layout (Agara Lake)', 'lat': 12.9234, 'lng': 77.6366},
    {'name': 'Koramangala (Sony World)', 'lat': 12.9345, 'lng': 77.6266},
    {'name': 'Basavanagudi (Bull Temple)', 'lat': 12.9416, 'lng': 77.5682},
    {'name': 'Silk Board Junction', 'lat': 12.9177, 'lng': 77.6238},
    {'name': 'Bommanahalli Junction', 'lat': 12.9022, 'lng': 77.6242},
    {'name': 'Kodichikknahalli', 'lat': 12.8984, 'lng': 77.6179},
    {'name': 'Electronics City Phase 1', 'lat': 12.8452, 'lng': 77.6602},
    {'name': 'Bannerghatta Road (Meenakshi Mall)', 'lat': 12.8753, 'lng': 77.5960},
    {'name': 'ISRO Layout', 'lat': 12.8950, 'lng': 77.5510},
    # --- Central Core (Connecting Hubs) ---
    {'name': 'MG Road Metro Station', 'lat': 12.9750, 'lng': 77.6060},
    {'name': 'Majestic (KBS)', 'lat': 12.9766, 'lng': 77.5713},
    {'name': 'Shanti Nagar Bus Station', 'lat': 12.9567, 'lng': 77.5925},
    {'name': 'Town Hall / JC Road', 'lat': 12.9634, 'lng': 77.5855},
    # --- West / North (City Connectivity Anchors) ---
    {'name': 'RV College of Engineering', 'lat': 12.9237, 'lng': 77.4987},
    {'name': 'Nayandahalli Junction', 'lat': 12.9427, 'lng': 77.5255},
    {'name': 'Vijayanagar', 'lat': 12.9719, 'lng': 77.5362},
    {'name': 'Malleshwaram 18th Cross', 'lat': 13.0135, 'lng': 77.5701},
    {'name': 'Yeshwanthpur', 'lat': 13.0238, 'lng': 77.5501},
    {'name': 'Hebbal Flyover', 'lat': 13.0382, 'lng': 77.5920},
    {'name': 'Peenya', 'lat': 13.0285, 'lng': 77.5197},
    {'name': 'Yelahanka New Town', 'lat': 13.0993, 'lng': 77.5828},
]


async def main() -> None:
    print(f'[INFO] Total waypoints to process: {len(BENGALURU_WAYPOINTS)}')

    engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)

    # Ensure the table exists (safe no-op if already created by the app)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    AsyncSession = async_sessionmaker(bind=engine, expire_on_commit=False)

    inserted = 0
    skipped = 0

    try:
        async with AsyncSession() as session:
            # Build a set of existing names to avoid N individual SELECT queries
            result = await session.execute(select(Waypoint.name))
            existing_names: set[str] = {name for (name,) in result.all()}

            for wp in BENGALURU_WAYPOINTS:
                if wp['name'] in existing_names:
                    skipped += 1
                    continue

                session.add(
                    Waypoint(
                        name=wp['name'],
                        geom=WKTElement(f'POINT({wp["lng"]} {wp["lat"]})', srid=4326),
                    )
                )
                existing_names.add(wp['name'])  # guard against duplicates in the list
                inserted += 1

            await session.commit()

        print(
            f'[INFO] Done. Inserted: {inserted} | Already existed (skipped): {skipped}'
        )
    except Exception as exc:
        print(f'[ERROR] {exc}', file=sys.stderr)
        sys.exit(1)
    finally:
        await engine.dispose()


if __name__ == '__main__':
    asyncio.run(main())
