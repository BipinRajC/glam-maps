from pydantic import BaseModel, Field


# --- Route ---
class RouteRequest(BaseModel):
    start_lat: float = Field(ge=-90, le=90, description='Latitude of the origin.')
    start_lng: float = Field(ge=-180, le=180, description='Longitude of the origin.')
    end_lat: float = Field(ge=-90, le=90, description='Latitude of the destination.')
    end_lng: float = Field(ge=-180, le=180, description='Longitude of the destination.')


class RouteResponse(BaseModel):
    route_id: int = Field(
        gt=0, description='Internal database ID for the generated route.'
    )
    encoded_polyline: str = Field(
        description='Google Maps encoded polyline string for frontend rendering.'
    )
    checkpoints: list['CheckpointResponse'] = Field(
        description='Ordered checkpoints along the route (pothole clusters + smooth stretches).'
    )


# --- Checkpoints ---
class CheckpointResponse(BaseModel):
    id: str = Field(description='Unique identifier for the checkpoint.')
    lat: float = Field(
        ge=-90, le=90, description='Latitude of the checkpoint cluster center.'
    )
    lng: float = Field(
        ge=-180, le=180, description='Longitude of the checkpoint cluster center.'
    )
    checkpoint_type: str = Field(
        description="Type of checkpoint: 'pothole', 'smooth', or 'traffic'."
    )
    image_url: str | None = Field(
        None,
        description='URL to the Supabase S3 bucket image (null if not a pothole checkpoint).',
    )
    message: str = Field(
        description='Playful notification string mapped to the checkpoint type.'
    )
    traffic_speed: str | None = Field(
        None,
        description="Traffic speed level: 'NORMAL', 'SLOW', or 'TRAFFIC_JAM' (null for non-traffic checkpoints).",
    )
    pothole_count: int = Field(
        default=0,
        description='Number of potholes in this cluster (0 for non-pothole checkpoints).',
    )


# --- Glam Score ---
class GlamScoreResponse(BaseModel):
    score: int = Field(ge=1, le=100, description='The final Glam Score (1-100).')
    pothole_penalty: float = Field(
        ge=0, description='Deduction amount based on pothole density.'
    )
    traffic_penalty: float = Field(
        ge=0, description='Deduction amount based on current traffic vs free-flow.'
    )
    road_penalty: float = Field(
        ge=0, description='Deduction amount based on OSM road classification.'
    )
