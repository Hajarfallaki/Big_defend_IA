from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.core.database import get_db
from app.schemas.transaction import TransactionCreate, TransactionRead

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# Ajouter une transaction
@router.post("/add", response_model=TransactionRead)
def add_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    new_transaction = Transaction(
        montant=transaction.montant,
        date=transaction.date,
        type_transaction=transaction.type_transaction,
        statut="en attente",  # Statut initialement à 'en attente'
        banque_id=transaction.banque_id,  # ID de la banque qui a souscrit
        utilisateur_id=transaction.utilisateur_id,  # ID de l'utilisateur qui effectue la transaction
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

# Obtenir toutes les transactions
@router.get("/all", response_model=list[TransactionRead])
def get_all_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return transactions

# Obtenir les transactions d'une banque
@router.get("/banque/{banque_id}", response_model=list[TransactionRead])
def get_transactions_by_banque(banque_id: int, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.banque_id == banque_id).all()
    return transactions

