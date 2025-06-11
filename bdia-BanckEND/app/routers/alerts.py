# app/routers/alerts.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.schemas.alert import AlertRead
from app.core.database import get_db

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/all", response_model=list[AlertRead])
def get_all_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).all()

@router.get("/by_banque/{banque_id}", response_model=list[AlertRead])
def get_alerts_by_banque(banque_id: int, db: Session = Depends(get_db)):
    return db.query(Alert).filter(Alert.banque_id == banque_id).all()
