from fastapi import HTTPException
from geoalchemy2.functions import ST_X, ST_Y, ST_DWithin, ST_LineLocatePoint
from geoalchemy2.types import Geography
from sqlalchemy import cast, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Pothole, Route

# Buffer distance in metres for the ST_DWithin spatial filter.
_BUFFER_METRES = 50


def _route_geom_subquery(route_id: int):
    """Scalar subquery for the route geometry.

    Keeps the geometry as a server-side column reference,
    avoiding the asyncpg WKB serialization issue.
    """
    return select(Route.geom).filter(Route.id == route_id).scalar_subquery()


async def get_potholes_along_route(route_id: int, db: AsyncSession) -> list:
    """Fetch all potholes within the buffer of the route, ordered by position.

    Returns a list of Row objects: (Pothole, frac, lat, lng).
    """
    route = await db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail='Route not found')

    route_geom = _route_geom_subquery(route_id)

    frac_expr = ST_LineLocatePoint(route_geom, Pothole.geom).label('frac')
    lat_expr = ST_Y(Pothole.geom).label('lat')
    lng_expr = ST_X(Pothole.geom).label('lng')

    result = await db.execute(
        select(Pothole, frac_expr, lat_expr, lng_expr)
        .filter(
            ST_DWithin(
                cast(Pothole.geom, Geography),
                cast(route_geom, Geography),
                _BUFFER_METRES,
            )
        )
        .order_by(frac_expr)
    )
    return result.all()


async def count_potholes_on_route(route_id: int, db: AsyncSession) -> int:
    """Count potholes within the buffer of the route geometry."""
    route_geom = _route_geom_subquery(route_id)

    result = await db.execute(
        select(func.count())
        .select_from(Pothole)
        .filter(
            ST_DWithin(
                cast(Pothole.geom, Geography),
                cast(route_geom, Geography),
                _BUFFER_METRES,
            )
        )
    )
    return result.scalar_one()
