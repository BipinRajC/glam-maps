from datetime import datetime, timezone

from geoalchemy2 import Geometry
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Waypoint(Base):
    __tablename__ = 'waypoints'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    # SRID 4326 = WGS 84 GPS coordinates; spatial_index creates a GIST index
    geom: Mapped[str] = mapped_column(
        Geometry(geometry_type='POINT', srid=4326, spatial_index=True),
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Route(Base):
    __tablename__ = 'routes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    start_waypoint_id: Mapped[int] = mapped_column(
        ForeignKey('waypoints.id'), nullable=False
    )
    end_waypoint_id: Mapped[int] = mapped_column(
        ForeignKey('waypoints.id'), nullable=False
    )
    encoded_polyline: Mapped[str] = mapped_column(String, nullable=False)
    # LINESTRING used to check if pothole points fall along this path
    geom: Mapped[str] = mapped_column(
        Geometry(geometry_type='LINESTRING', srid=4326, spatial_index=True),
        nullable=False,
    )
    distance_meters: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    start_waypoint: Mapped[Waypoint] = relationship(
        'Waypoint', foreign_keys=[start_waypoint_id]
    )
    end_waypoint: Mapped[Waypoint] = relationship(
        'Waypoint', foreign_keys=[end_waypoint_id]
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


class Obstacle(Base):
    __tablename__ = 'obstacles'

    # OSM node IDs are integers
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # Classification of the hazard (e.g., 'bump', 'hump', 'crossing', 'rumble_strip')
    obstacle_type: Mapped[str] = mapped_column(String(50), nullable=False)
    geom: Mapped[str] = mapped_column(
        Geometry(geometry_type='POINT', srid=4326, spatial_index=True),
        nullable=False,
    )
