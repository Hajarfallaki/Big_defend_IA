from fastapi import Depends
from fastapi_users import BaseUserManager, IntegerIDMixin
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from app.models.user import User
from app.core.database import get_async_db

class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = "SECRET"  # Utilisez settings.SECRET_KEY en prod
    verification_token_secret = "SECRET"

    async def on_after_register(self, user: User, request=None):
        print(f"User {user.id} registered")

async def get_user_manager(user_db=Depends(get_async_db)):
    yield UserManager(SQLAlchemyUserDatabase(user_db, User))