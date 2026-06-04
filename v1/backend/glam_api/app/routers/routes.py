from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from glam_api.auth.campaign import verify_campaign_token
from glam_api.db.session import get_session
from glam_api.providers.precomputed import PrecomputedRouteProvider

router = APIRouter(dependencies=[Depends(verify_campaign_token)])


@router.get("/api/routes")
async def list_routes(city: str = "bengaluru", db: AsyncSession = Depends(get_session)):
    provider = PrecomputedRouteProvider(db)
    routes = await provider.list_routes(city)
    return {
        "city": city,
        "routes": [
            {
                "id": r.id,
                "name": r.name,
                "originLabel": r.origin_label,
                "destLabel": r.dest_label,
                "distanceM": r.distance_m,
                "glamScore": r.glam_score,
                "scoreBand": r.score_band,
            }
            for r in routes
        ],
    }


@router.get("/api/routes/{route_id}")
async def get_route(route_id: str, db: AsyncSession = Depends(get_session)):
    provider = PrecomputedRouteProvider(db)
    bundle = await provider.get_route_bundle(route_id)
    if not bundle:
        raise HTTPException(status_code=404, detail="Route not found")
    return bundle
