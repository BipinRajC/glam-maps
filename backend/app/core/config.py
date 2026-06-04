from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = 'Glam Maps API'
    DATABASE_URL: str = 'postgresql://postgres:password@localhost:5432/glammaps'
    GOOGLE_MAPS_ROUTES_API: str = ''
    PORT: int = 8000
    HOST: str = '0.0.0.0'
    ENV: str = 'dev'

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')


settings = Settings()
