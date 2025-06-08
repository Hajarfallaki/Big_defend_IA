from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    montant = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    type_transaction = Column(String, nullable=False)  # Exemple: 'dépôt', 'retrait'
    statut = Column(String, nullable=False, default="en attente")  # 'frauduleuse', 'validée', 'en attente'
    banque_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Relier à l'utilisateur banque
    utilisateur_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Relier à l'utilisateur client (si nécessaire) a changer en fonction du user id dans le datset 
    
    banque = relationship("User", backref="transactions_banque")
    utilisateur = relationship("User", backref="transactions_client")

