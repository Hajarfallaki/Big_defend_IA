# app/models/transaction.py (ou dans ton dossier models)

from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from app.core.database import Base  # ou selon ton projet
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer)
    banque_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Relier à l'utilisateur banque
    user_id = Column(Integer)
    transaction_amount = Column(Float)
    transaction_type = Column(String)
    timestamp = Column(DateTime)
    account_balance = Column(Float)
    device_type = Column(String)
    location = Column(String)
    merchant_category = Column(String)
    ip_address_flag = Column(Integer)
    previous_fraudulent_activity = Column(Integer)
    daily_transaction_count = Column(Integer)
    avg_transaction_amount_7d = Column(Float)
    failed_transaction_count_7d = Column(Integer)
    card_type = Column(String)
    card_age = Column(Integer)
    transaction_distance = Column(Float)
    authentication_method = Column(String)
    risk_score = Column(Float)
    is_weekend = Column(Boolean)

    # Champs ajoutés par ton système de prédiction
    is_fraud = Column(Boolean)
    fraud_probability = Column(Float)

    banque = relationship("User", backref="transactions_banque")
