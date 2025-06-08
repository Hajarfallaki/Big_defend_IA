from fastapi import FastAPI
from fastapi_users import FastAPIUsers
from app.core.database import async_engine, Base
from app.core.config import settings
from app.models.user import User
from app.auth.user_manager import get_user_manager
from app.schemas.user import UserRead, UserCreate  # Ajout des schémas
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)

app = FastAPI()

# Configuration JWT
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.SECRET_KEY,
        lifetime_seconds=3600
    )

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

@app.on_event("startup")
async def startup():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Routes d'authentification
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),  # Route d'inscription
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

# app.include_router(
#     fastapi_users.get_users_router(UserRead, UserUpdate),  # Optionnel : gestion users
#     prefix="/users",
#     tags=["users"],
# )