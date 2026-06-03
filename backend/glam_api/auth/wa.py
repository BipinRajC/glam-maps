import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from glam_api.db.models import WaSession


async def get_wa_session(session_id: uuid.UUID, db: AsyncSession) -> WaSession:
    result = await db.execute(select(WaSession).where(WaSession.id == session_id))
    wa_session = result.scalar_one_or_none()
    if not wa_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return wa_session
