"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-06-04
"""
from typing import Sequence, Union

import geoalchemy2
import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    op.create_table(
        "potholes",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("complaint_id", sa.UUID(as_uuid=True), nullable=False),
        sa.Column("source_id", sa.Text(), nullable=True),
        sa.Column("city", sa.Text(), nullable=False, server_default="bengaluru"),
        sa.Column(
            "geom",
            geoalchemy2.types.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("evidence_url", sa.Text(), nullable=True),
        sa.Column("report_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("language", sa.Text(), nullable=True),
        sa.Column("reported_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("synced_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("complaint_id"),
    )
    op.create_index("potholes_geom_gix", "potholes", ["geom"], postgresql_using="gist")
    op.create_index("potholes_city_idx", "potholes", ["city", "status"])
    op.create_index("potholes_time_idx", "potholes", ["reported_at"])

    op.create_table(
        "routes",
        sa.Column("id", sa.Text(), nullable=False),
        sa.Column("city", sa.Text(), nullable=False, server_default="bengaluru"),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("origin_label", sa.Text(), nullable=False),
        sa.Column("dest_label", sa.Text(), nullable=False),
        sa.Column("reverse_of", sa.Text(), nullable=True),
        sa.Column(
            "polyline",
            geoalchemy2.types.Geography(geometry_type="LINESTRING", srid=4326),
            nullable=False,
        ),
        sa.Column("distance_m", sa.Integer(), nullable=False),
        sa.Column("glam_score", sa.Integer(), nullable=True),
        sa.Column("score_band", sa.Text(), nullable=True),
        sa.Column("computed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["reverse_of"], ["routes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("routes_polyline_gix", "routes", ["polyline"], postgresql_using="gist")
    op.create_index("routes_city_idx", "routes", ["city"])

    op.create_table(
        "glam_risk_zones",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("route_id", sa.Text(), nullable=False),
        sa.Column("city", sa.Text(), nullable=False, server_default="bengaluru"),
        sa.Column("seq", sa.Integer(), nullable=False),
        sa.Column("start_dist_m", sa.Integer(), nullable=False),
        sa.Column("end_dist_m", sa.Integer(), nullable=False),
        sa.Column(
            "alert_point",
            geoalchemy2.types.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column(
            "geom",
            geoalchemy2.types.Geography(geometry_type="POLYGON", srid=4326),
            nullable=True,
        ),
        sa.Column("pothole_count", sa.Integer(), nullable=False),
        sa.Column("intensity", sa.Text(), nullable=False),
        sa.Column("rep_pothole_id", sa.BigInteger(), nullable=True),
        sa.Column("label", sa.Text(), nullable=False),
        sa.Column("copy", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["rep_pothole_id"], ["potholes.id"]),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("route_id", "seq"),
    )
    op.create_index("zones_geom_gix", "glam_risk_zones", ["geom"], postgresql_using="gist")
    op.create_index("zones_route_idx", "glam_risk_zones", ["route_id", "seq"])

    op.create_table(
        "zone_potholes",
        sa.Column("zone_id", sa.BigInteger(), nullable=False),
        sa.Column("pothole_id", sa.BigInteger(), nullable=False),
        sa.ForeignKeyConstraint(["pothole_id"], ["potholes.id"]),
        sa.ForeignKeyConstraint(["zone_id"], ["glam_risk_zones.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("zone_id", "pothole_id"),
    )

    op.create_table(
        "sync_runs",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("fetched_count", sa.Integer(), nullable=True),
        sa.Column("upserted_count", sa.Integer(), nullable=True),
        sa.Column("pruned_count", sa.Integer(), nullable=True),
        sa.Column("status", sa.Text(), nullable=False, server_default="running"),
        sa.Column("error", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "wa_sessions",
        sa.Column("id", sa.UUID(as_uuid=True), nullable=False),
        sa.Column("phone_e164", sa.Text(), nullable=False),
        sa.Column("route_id", sa.Text(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False, server_default="pending_optin"),
        sa.Column("last_zone_seq", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("consent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("wa_sessions_phone_idx", "wa_sessions", ["phone_e164"])
    op.create_index("wa_sessions_status_idx", "wa_sessions", ["status"])

    op.create_table(
        "wa_events",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("session_id", sa.UUID(as_uuid=True), nullable=False),
        sa.Column("type", sa.Text(), nullable=False),
        sa.Column("zone_seq", sa.Integer(), nullable=True),
        sa.Column("payload", sa.dialects.postgresql.JSONB(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["session_id"], ["wa_sessions.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "road_features",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("city", sa.Text(), nullable=False, server_default="bengaluru"),
        sa.Column("feature_type", sa.Text(), nullable=False),
        sa.Column(
            "geom",
            geoalchemy2.types.Geography(geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        sa.Column("osm_id", sa.BigInteger(), nullable=True),
        sa.Column("name", sa.Text(), nullable=True),
        sa.Column("source", sa.Text(), nullable=False, server_default="osm"),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("road_features_geom_gix", "road_features", ["geom"], postgresql_using="gist")
    op.create_index("road_features_city_idx", "road_features", ["city", "feature_type"])


def downgrade() -> None:
    op.drop_table("road_features")
    op.drop_table("wa_events")
    op.drop_table("wa_sessions")
    op.drop_table("sync_runs")
    op.drop_table("zone_potholes")
    op.drop_table("glam_risk_zones")
    op.drop_table("routes")
    op.drop_table("potholes")
