from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    montant: float
    date: datetime
    type_transaction: str
    statut: Optional[str] = "en attente"  # Par défaut, statut est 'en attente'
    banque_id: int
    utilisateur_id: int

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int

    class Config:
        orm_mode = True
