import uuid
from datetime import datetime
from typing import List, Optional

from geoalchemy2 import Geography
from sqlalchemy import (
    BigInteger,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class Pothole(Base):
    __tablename__ = "potholes"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    complaint_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), unique=True, nullable=False)
    source_id: Mapped[Optional[str]] = mapped_column(Text)
    city: Mapped[str] = mapped_column(Text, nullable=False, default="bengaluru")
    geom = mapped_column(Geography("POINT", srid=4326), nullable=False)
    status: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(Text)
    evidence_url: Mapped[Optional[str]] = mapped_column(Text)
    report_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    language: Mapped[Optional[str]] = mapped_column(Text)
    reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        Index("potholes_geom_gix", geom, postgresql_using="gist"),
        Index("potholes_city_idx", "city", "status"),
        Index("potholes_time_idx", "reported_at"),
    )


class Route(Base):
    __tablename__ = "routes"

    id: Mapped[str] = mapped_column(Text, primary_key=True)
    city: Mapped[str] = mapped_column(Text, nullable=False, default="bengaluru")
    name: Mapped[str] = mapped_column(Text, nullable=False)
    origin_label: Mapped[str] = mapped_column(Text, nullable=False)
    dest_label: Mapped[str] = mapped_column(Text, nullable=False)
    reverse_of: Mapped[Optional[str]] = mapped_column(Text, ForeignKey("routes.id"))
    polyline = mapped_column(Geography("LINESTRING", srid=4326), nullable=False)
    distance_m: Mapped[int] = mapped_column(Integer, nullable=False)
    glam_score: Mapped[Optional[int]] = mapped_column(Integer)
    score_band: Mapped[Optional[str]] = mapped_column(Text)
    computed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    zones: Mapped[List["GlamRiskZone"]] = relationship(
        back_populates="route", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("routes_polyline_gix", polyline, postgresql_using="gist"),
        Index("routes_city_idx", "city"),
    )


class GlamRiskZone(Base):
    __tablename__ = "glam_risk_zones"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    route_id: Mapped[str] = mapped_column(
        Text, ForeignKey("routes.id", ondelete="CASCADE"), nullable=False
    )
    city: Mapped[str] = mapped_column(Text, nullable=False, default="bengaluru")
    seq: Mapped[int] = mapped_column(Integer, nullable=False)
    start_dist_m: Mapped[int] = mapped_column(Integer, nullable=False)
    end_dist_m: Mapped[int] = mapped_column(Integer, nullable=False)
    alert_point = mapped_column(Geography("POINT", srid=4326), nullable=False)
    geom = mapped_column(Geography("POLYGON", srid=4326))
    pothole_count: Mapped[int] = mapped_column(Integer, nullable=False)
    intensity: Mapped[str] = mapped_column(Text, nullable=False)
    rep_pothole_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("potholes.id"))
    label: Mapped[str] = mapped_column(Text, nullable=False)
    copy: Mapped[str] = mapped_column(Text, nullable=False)

    route: Mapped["Route"] = relationship(back_populates="zones")

    __table_args__ = (
        UniqueConstraint("route_id", "seq"),
        Index("zones_geom_gix", geom, postgresql_using="gist"),
        Index("zones_route_idx", "route_id", "seq"),
    )


class ZonePothole(Base):
    __tablename__ = "zone_potholes"

    zone_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("glam_risk_zones.id", ondelete="CASCADE"), primary_key=True
    )
    pothole_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("potholes.id"), primary_key=True
    )


class SyncRun(Base):
    __tablename__ = "sync_runs"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    fetched_count: Mapped[Optional[int]] = mapped_column(Integer)
    upserted_count: Mapped[Optional[int]] = mapped_column(Integer)
    pruned_count: Mapped[Optional[int]] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(Text, nullable=False, default="running")
    error: Mapped[Optional[str]] = mapped_column(Text)


class WaSession(Base):
    __tablename__ = "wa_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    phone_e164: Mapped[str] = mapped_column(Text, nullable=False)
    route_id: Mapped[str] = mapped_column(Text, ForeignKey("routes.id"), nullable=False)
    status: Mapped[str] = mapped_column(Text, nullable=False, default="pending_optin")
    last_zone_seq: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    consent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    events: Mapped[List["WaEvent"]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("wa_sessions_phone_idx", "phone_e164"),
        Index("wa_sessions_status_idx", "status"),
    )


class WaEvent(Base):
    __tablename__ = "wa_events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("wa_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    type: Mapped[str] = mapped_column(Text, nullable=False)
    zone_seq: Mapped[Optional[int]] = mapped_column(Integer)
    payload = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    session: Mapped["WaSession"] = relationship(back_populates="events")


class RoadFeature(Base):
    __tablename__ = "road_features"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    city: Mapped[str] = mapped_column(Text, nullable=False, default="bengaluru")
    feature_type: Mapped[str] = mapped_column(Text, nullable=False)
    geom = mapped_column(Geography("POINT", srid=4326), nullable=False)
    osm_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    name: Mapped[Optional[str]] = mapped_column(Text)
    source: Mapped[str] = mapped_column(Text, nullable=False, default="osm")
    fetched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        Index("road_features_geom_gix", geom, postgresql_using="gist"),
        Index("road_features_city_idx", "city", "feature_type"),
    )
