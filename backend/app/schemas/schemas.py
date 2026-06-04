from pydantic import BaseModel, Field


# --- Snap to Waypoint ---
class WaypointInput(BaseModel):
    lat: float = Field(ge=-90, le=90, description="Latitude of the user's location.")
    lng: float = Field(ge=-180, le=180, description="Longitude of the user's location.")


class WaypointResponse(BaseModel):
    id: int = Field(gt=0, description='Unique identifier of the snapped waypoint.')
    name: str = Field(description='Display name of the waypoint.')
    lat: float = Field(ge=-90, le=90, description='Latitude of the waypoint.')
    lng: float = Field(ge=-180, le=180, description='Longitude of the waypoint.')
    distance_meters: float = Field(
        ge=0, description='Distance from the requested coordinates to the waypoint.'
    )


# --- Route ---
class RouteRequest(BaseModel):
    start_waypoint_id: int = Field(gt=0, description='ID of the origin waypoint.')
    end_waypoint_id: int = Field(gt=0, description='ID of the destination waypoint.')


class RouteResponse(BaseModel):
    route_id: int = Field(
        gt=0, description='Internal database ID for the generated route.'
    )
    encoded_polyline: str = Field(
        description='Google Maps encoded polyline string for frontend rendering.'
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
    image_url: str | None = Field(
        None,
        description='URL to the Supabase S3 bucket image (null if smooth stretch).',
    )
    message: str = Field(
        description='Playful notification string mapped to the cluster type.'
    )
    is_smooth_stretch: bool = Field(
        description='True if this checkpoint represents a lack of potholes.'
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


# --- Obstacle ---
class ObstacleResponse(BaseModel):
    id: int = Field(description='OpenStreetMap node ID of the obstacle.')
    obstacle_type: str = Field(
        description="Classification of the hazard (e.g., 'bump', 'hump', 'crossing', 'rumble_strip')."
    )
    lat: float = Field(ge=-90, le=90, description='Latitude of the obstacle.')
    lng: float = Field(ge=-180, le=180, description='Longitude of the obstacle.')
