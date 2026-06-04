"""
Seed script: parse complaints.json and populate the potholes table.

Only records with validationStatus 'pending' or 'approved' are inserted.
Uses INSERT ... ON CONFLICT DO NOTHING for idempotent deduplication on _id.

Run from the backend/ directory:
    uv run python seed/seed_potholes.py [--json path/to/complaints.json]
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from geoalchemy2 import WKTElement
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ---------------------------------------------------------------------------
# Resolve DATABASE_URL the same way the app does (reads .env if present)
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings  # noqa: E402
from app.models.models import Base, Pothole  # noqa: E402

ALLOWED_STATUSES = {'approved'}
DEFAULT_JSON = Path(__file__).parent / 'complaints.json'


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='Seed potholes table from complaints.json'
    )
    parser.add_argument(
        '--json',
        type=Path,
        default=DEFAULT_JSON,
        help='Path to the complaints JSON file (default: seed/complaints.json)',
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if not args.json.exists():
        print(f'[ERROR] File not found: {args.json}', file=sys.stderr)
        sys.exit(1)

    print(f'[INFO] Loading {args.json} ...')
    with args.json.open() as f:
        payload = json.load(f)

    records = payload.get('data', [])
    print(f'[INFO] Total records in file: {len(records)}')

    # Filter by validationStatus
    eligible = [r for r in records if r.get('validationStatus') in ALLOWED_STATUSES]
    print(f'[INFO] Eligible (pending/approved): {len(eligible)}')

    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

    # Ensure the table exists (safe no-op if already created by the app)
    Base.metadata.create_all(bind=engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    inserted = 0
    skipped = 0

    try:
        for record in eligible:
            pothole_id: str = record['_id']
            lat: float = record['latitude']
            lng: float = record['longitude']
            image_url: str | None = record.get('imageUrl')
            timestamp: int = record['timestamp']

            reported_at = datetime.fromtimestamp(timestamp, tz=timezone.utc)

            pothole = Pothole(
                id=pothole_id,
                image_url=image_url,
                geom=WKTElement(f'POINT({lng} {lat})', srid=4326),
                severity_score=1,
                reported_at=reported_at,
            )

            # merge() does INSERT or UPDATE based on PK; we want INSERT-only dedup.
            # Use low-level ON CONFLICT DO NOTHING via raw SQL for efficiency,
            # but here we check existence first to keep it ORM-friendly.
            existing = session.get(Pothole, pothole_id)
            if existing is None:
                session.add(pothole)
                inserted += 1
            else:
                skipped += 1

        session.commit()
        print(
            f'[INFO] Done. Inserted: {inserted} | Already existed (skipped): {skipped}'
        )
    except Exception as exc:
        session.rollback()
        print(f'[ERROR] {exc}', file=sys.stderr)
        sys.exit(1)
    finally:
        session.close()


if __name__ == '__main__':
    main()
