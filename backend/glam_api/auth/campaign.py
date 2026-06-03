from fastapi import Header, HTTPException

from glam_api.settings import settings


async def verify_campaign_token(x_campaign_token: str = Header(...)):
    if x_campaign_token != settings.campaign_token:
        raise HTTPException(status_code=401, detail="Invalid campaign token")
