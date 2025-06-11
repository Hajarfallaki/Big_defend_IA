from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://bdia_user:bdia_pass@localhost/bdia_db"
    SYNC_DATABASE_URL: str = "postgresql://bdia_user:bdia_pass@localhost/bdia_db"
    SECRET_KEY: str

    # # ✅ MongoDB : URI complète avec base incluse (logs_db)
    # MONGODB_URI: str ="mongodb://localhost:27017/logs_db"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
