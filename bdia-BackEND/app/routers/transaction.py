from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.models.transaction import Transaction
from app.core.database import get_db
from app.schemas.transaction import TransactionCreate, TransactionRead
from app.services.fraud_detection import predict_fraud
from app.logging.log_setup import logger

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# Ajouter une transaction et analyser la fraude
@router.post("/add", response_model=TransactionRead)
def add_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    try:
        # Prédiction de la fraude
        fraud_score = predict_fraud(transaction.dict())
        is_fraud = fraud_score > 0.8

        # Création de la transaction
        new_transaction = Transaction(
            transaction_id=transaction.transaction_id,
            banque_id=transaction.banque_id,
            user_id=transaction.user_id,
            transaction_amount=transaction.transaction_amount,
            transaction_type=transaction.transaction_type,
            timestamp=transaction.timestamp,
            account_balance=transaction.account_balance,
            device_type=transaction.device_type,
            location=transaction.location,
            merchant_category=transaction.merchant_category,
            ip_address_flag=transaction.ip_address_flag,
            previous_fraudulent_activity=transaction.previous_fraudulent_activity,
            daily_transaction_count=transaction.daily_transaction_count,
            avg_transaction_amount_7d=transaction.avg_transaction_amount_7d,
            failed_transaction_count_7d=transaction.failed_transaction_count_7d,
            card_type=transaction.card_type,
            card_age=transaction.card_age,
            transaction_distance=transaction.transaction_distance,
            authentication_method=transaction.authentication_method,
            risk_score=transaction.risk_score,
            is_weekend=transaction.is_weekend,
            is_fraud=is_fraud,
            fraud_probability=fraud_score,
        )

        db.add(new_transaction)
        db.commit()
        db.refresh(new_transaction)

        # Créer une alerte si la transaction est frauduleuse
        if fraud_score > 0.8:
            alert = Alert(
                transaction_id=new_transaction.id,
                banque_id=transaction.banque_id,
                fraud_probability=fraud_score,
                message="Transaction suspecte détectée avec une probabilité de {:.2f}".format(fraud_score),
            )
            db.add(alert)
            db.commit()
            db.refresh(alert)

        return new_transaction

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur pendant l'ajout de la transaction : {str(e)}")


# Obtenir toutes les transactions
@router.get("/all", response_model=list[TransactionRead])
def get_all_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()

# Obtenir les transactions d'une banque spécifique
@router.get("/banque/{banque_id}", response_model=list[TransactionRead])
def get_transactions_by_banque(banque_id: int, db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.banque_id == banque_id).all()
