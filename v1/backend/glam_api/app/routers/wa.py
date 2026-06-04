import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from glam_api.auth.wa import get_wa_session
from glam_api.db.models import Route, WaEvent, WaSession
from glam_api.db.session import get_session
from glam_api.geo.helpers import locate_point_on_line
from glam_api.settings import settings
from glam_api.wa.client import WabaClient
from glam_api.wa.webhook import parse_webhook

router = APIRouter(prefix="/api/wa")


def _waba() -> WabaClient:
    return WabaClient(
        base_url=settings.waba_base_url,
        license_number=settings.waba_license_number,
        api_key=settings.waba_api_key,
    )


class SubscribeRequest(BaseModel):
    phone: str
    routeId: str


class PositionRequest(BaseModel):
    sessionId: uuid.UUID
    lat: float
    lng: float


class EndRequest(BaseModel):
    sessionId: uuid.UUID


@router.post("/subscribe")
async def subscribe(req: SubscribeRequest, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Route).where(Route.id == req.routeId))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Route not found")

    phone = req.phone.lstrip("+")
    session = WaSession(phone_e164=phone, route_id=req.routeId)
    db.add(session)
    await db.flush()
    db.add(WaEvent(session_id=session.id, type="optin_sent"))
    await db.commit()

    await _waba().send_button(
        contact=phone,
        message="Welcome to Glam Maps! Confirm to get pothole alerts on your route.",
        buttons="Confirm.Skip",
        header_text="Glam Maps Alerts",
    )
    return {"sessionId": str(session.id)}


@router.post("/position")
async def position(req: PositionRequest, db: AsyncSession = Depends(get_session)):
    from geoalchemy2.shape import to_shape
    from shapely.geometry import Point
    from sqlalchemy import and_

    from glam_api.db.models import GlamRiskZone

    wa_session = await get_wa_session(req.sessionId, db)
    if wa_session.status not in ("confirmed", "active"):
        raise HTTPException(status_code=400, detail="Session not active")

    result = await db.execute(select(Route).where(Route.id == wa_session.route_id))
    route = result.scalar_one_or_none()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    route_shape = to_shape(route.polyline)
    frac = locate_point_on_line(route_shape, Point(req.lng, req.lat))
    dist_along = frac * route.distance_m

    result = await db.execute(
        select(GlamRiskZone)
        .where(
            and_(
                GlamRiskZone.route_id == wa_session.route_id,
                GlamRiskZone.seq > wa_session.last_zone_seq,
            )
        )
        .order_by(GlamRiskZone.seq)
    )
    for zone in result.scalars():
        ahead = zone.start_dist_m - dist_along
        if 0 < ahead <= 200:
            copy_text = zone.copy.replace("{dist}", str(round(ahead)))
            await _waba().send_text(contact=wa_session.phone_e164, message=copy_text)
            wa_session.last_zone_seq = zone.seq
            wa_session.status = "active"
            wa_session.updated_at = datetime.now(timezone.utc)
            db.add(WaEvent(session_id=wa_session.id, type="alert_sent", zone_seq=zone.seq))
            await db.commit()
            return {"alerted": True, "nextZoneSeq": zone.seq}

    return {"alerted": False}


@router.post("/end")
async def end(req: EndRequest, db: AsyncSession = Depends(get_session)):
    wa_session = await get_wa_session(req.sessionId, db)
    result = await db.execute(select(Route).where(Route.id == wa_session.route_id))
    route = result.scalar_one_or_none()

    score_text = f"Your Glam Score: {route.glam_score}/100"
    if route.score_band:
        score_text += f" — {route.score_band}"
    score_text += "\nUnlock your Flipkart Glam deals!"

    await _waba().send_text(contact=wa_session.phone_e164, message=score_text)
    wa_session.status = "ended"
    wa_session.updated_at = datetime.now(timezone.utc)
    db.add(WaEvent(session_id=wa_session.id, type="score_sent"))
    await db.commit()
    return {"ended": True}


@router.post("/webhook")
async def webhook(payload: dict, db: AsyncSession = Depends(get_session)):
    messages = parse_webhook(payload)
    for msg in messages:
        if msg.type == "button_reply" and msg.button_id == "Confirm":
            result = await db.execute(
                select(WaSession)
                .where(WaSession.phone_e164 == msg.sender)
                .where(WaSession.status == "pending_optin")
                .order_by(WaSession.created_at.desc())
            )
            wa_session = result.scalars().first()
            if wa_session:
                wa_session.status = "confirmed"
                wa_session.consent_at = datetime.now(timezone.utc)
                wa_session.updated_at = datetime.now(timezone.utc)
                db.add(WaEvent(session_id=wa_session.id, type="optin_confirmed"))
                await db.commit()
    return {"status": "ok"}
