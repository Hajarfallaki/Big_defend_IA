from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserRead
from app.models.user import User
from app.core.database import get_db
from app.auth.hash import hash_password
from app.logging.log_setup import logger

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    new_user = User(
        nom=user.nom,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
