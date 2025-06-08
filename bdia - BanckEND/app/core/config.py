from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://bdia_user:bdia_pass@localhost/bdia_db"
    SYNC_DATABASE_URL: str = "postgresql://bdia_user:bdia_pass@localhost/bdia_db"
    SECRET_KEY: str
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore les variables non déclarées

settings = Settings()