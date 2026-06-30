from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Resume Parser API"
    environment: str = Field(default="development", alias="ENVIRONMENT")
    database_url: str = Field(default="postgresql+psycopg://postgres:postgres@localhost:5432/resume_parser", alias="DATABASE_URL")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4.1-mini", alias="OPENAI_MODEL")
    openai_embedding_model: str = Field(default="text-embedding-3-large", alias="OPENAI_EMBEDDING_MODEL")
    jwt_secret: str = Field(default="change-me-in-production", alias="JWT_SECRET")
    cors_origins: list[AnyHttpUrl] | list[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    max_upload_mb: int = 25


@lru_cache
def get_settings() -> Settings:
    return Settings()
