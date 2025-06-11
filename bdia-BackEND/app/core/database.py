from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.base import Base

# Configuration asynchrone
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True
)

AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Configuration synchrone
sync_engine = create_engine(settings.SYNC_DATABASE_URL)
SyncSessionLocal = sessionmaker(bind=sync_engine)

async def get_async_db():
    async with AsyncSessionLocal() as db:
        yield db

# ✅ Pour usage sync (ex : dépendances classiques dans tes routes actuelles)
def get_db():
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()