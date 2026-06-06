from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Route
from app.schemas.schemas import LeaderboardEntry, LeaderboardResponse

router = APIRouter()


@router.get('/leaderboard', response_model=LeaderboardResponse)
async def get_leaderboard(db: AsyncSession = Depends(get_db)) -> LeaderboardResponse:
    """Return the top 10 routes with the highest Glam Scores."""

    result = await db.execute(
        select(Route)
        .filter(Route.glam_score.isnot(None))
        .order_by(Route.glam_score.desc())
        .limit(10)
    )
    routes = result.scalars().all()

    entries = [
        LeaderboardEntry(
            rank=i + 1,
            route_id=r.id,
            glam_score=r.glam_score,
            distance_meters=r.distance_meters,
            duration_seconds=r.duration_seconds,
            start_lat=r.start_lat,
            start_lng=r.start_lng,
            end_lat=r.end_lat,
            end_lng=r.end_lng,
        )
        for i, r in enumerate(routes)
    ]

    return LeaderboardResponse(entries=entries)
