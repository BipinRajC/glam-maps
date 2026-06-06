from datetime import datetime, timezone

from geoalchemy2 import Geometry
from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Route(Base):
    __tablename__ = 'routes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    start_lat: Mapped[float] = mapped_column(Float, nullable=False)
    start_lng: Mapped[float] = mapped_column(Float, nullable=False)
    end_lat: Mapped[float] = mapped_column(Float, nullable=False)
    end_lng: Mapped[float] = mapped_column(Float, nullable=False)
    encoded_polyline: Mapped[str] = mapped_column(String, nullable=False)
    # LINESTRING used to check if pothole points fall along this path
    geom: Mapped[str] = mapped_column(
        Geometry(geometry_type='LINESTRING', srid=4326, spatial_index=True),
        nullable=False,
    )
    distance_meters: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    glam_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # Cached speedReadingIntervals from Google Routes API (TRAFFIC_ON_POLYLINE)
    speed_intervals: Mapped[list | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Pothole(Base):
    __tablename__ = 'potholes'

    # String ID to hold the MongoDB ObjectId string directly
    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    geom: Mapped[str] = mapped_column(
        Geometry(geometry_type='POINT', srid=4326, spatial_index=True),
        nullable=False,
    )
    severity_score: Mapped[int] = mapped_column(Integer, default=1)
    reported_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
