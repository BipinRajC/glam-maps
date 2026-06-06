from fastapi import APIRouter

from app.api.glam_score import router as leaderboard_router
from app.api.health import router as health_router
from app.api.routes import router as routes_router

router = APIRouter()
router.include_router(health_router)
router.include_router(routes_router)
router.include_router(leaderboard_router)
