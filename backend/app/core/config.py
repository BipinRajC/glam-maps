from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = 'Glam Maps API'
    DATABASE_URL: str = 'postgresql://postgres:password@localhost:5432/glammaps'

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')


settings = Settings()
