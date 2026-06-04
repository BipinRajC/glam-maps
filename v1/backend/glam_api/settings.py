from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://localhost:5432/glam"

    nammapothole_api_base: str = ""
    nammapothole_api_token: str = ""

    maps_browser_key: str = ""
    maps_server_key: str = ""

    campaign_token: str = "changeme"

    journey_default_mode: str = "simulated"

    waba_license_number: str = ""
    waba_api_key: str = ""
    waba_base_url: str = "https://login.wabaconnect.com/api"
    waba_image_cdn: str = "https://datads1.btpr.online/Whatsapp"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
