"""
Service layer for calling the Google Maps Routes API v2 (REST).

Uses the computeRoutes endpoint with an API key to get an encoded polyline
and distance between two lat/lng pairs.
"""

import httpx

from app.core.config import settings
from app.core.logger import logger

COMPUTE_ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes'


async def compute_route(
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
) -> dict:
    """Call Google Maps Routes API and return the best route.

    Returns a dict with keys:
        - encoded_polyline: str
        - distance_meters: int | None

    Raises httpx.HTTPStatusError on non-2xx responses.
    """
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': settings.GOOGLE_MAPS_ROUTES_API,
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.polyline.encodedPolyline',
    }

    payload = {
        'origin': {
            'location': {
                'latLng': {'latitude': origin_lat, 'longitude': origin_lng},
            },
        },
        'destination': {
            'location': {
                'latLng': {'latitude': dest_lat, 'longitude': dest_lng},
            },
        },
        'travelMode': 'DRIVE',
        'routingPreference': 'TRAFFIC_AWARE',
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(COMPUTE_ROUTES_URL, json=payload, headers=headers)

    logger.info(f'Google Routes API responded with status {resp.status_code}')
    if resp.status_code != 200:
        logger.error(f'Google Routes API response body: {resp.text}')
    resp.raise_for_status()

    data = resp.json()
    route = data['routes'][0]

    return {
        'encoded_polyline': route['polyline']['encodedPolyline'],
        'distance_meters': route.get('distanceMeters'),
    }
