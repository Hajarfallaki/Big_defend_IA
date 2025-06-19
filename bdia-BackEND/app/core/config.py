from pydantic_settings import BaseSettings
from typing import List
from pydantic import field_validator


class Settings(BaseSettings):
    ELASTICSEARCH_URL: str = "http://localhost:9200"
    LOGSTASH_HOST: str = "localhost:5045"  # Port TCP pour L
    DATABASE_URL: str = "postgresql+asyncpg://bdia_user:bdia_pass@localhost/bdia_db"
    SYNC_DATABASE_URL: str = "postgresql://bdia_user:bdia_pass@localhost/bdia_db"
    SECRET_KEY: str
    ALLOWED_ORIGINS: List[str] = []

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def split_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
