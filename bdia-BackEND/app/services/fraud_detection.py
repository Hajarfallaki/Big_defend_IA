import joblib
import numpy as np
from app.models.schemas import TransactionInput
from app.logging.log_setup import logger

# Chargement du modèle et du scaler
model = joblib.load("app/ml_models/XGBoost.pkl")
scaler = joblib.load("app/ml_models/scaler.pkl")

def preprocess_transaction(transaction: TransactionInput) -> np.ndarray:
    """
    Prétraite une transaction pour la prédiction de fraude.
    
    Args:
        transaction (TransactionInput): Données de la transaction.
        
    Returns:
        np.ndarray: Features prétraitées pour le modèle.
        
    Raises:
        RuntimeError: Si le prétraitement échoue.
    """
    try:
        # Extraction des features pertinentes pour la prédiction
        features = np.array([[
            transaction.transaction_amount,
            transaction.account_balance,
            transaction.transaction_amount / (transaction.account_balance + 1e-6),  # Éviter la division par zéro
            float(transaction.transaction_type == "achat"),
            float(transaction.transaction_type == "retrait"),
            float(transaction.transaction_type == "virement"),
            float(transaction.transaction_amount > transaction.account_balance * 0.5),  # Transaction élevée
            transaction.balance_change,
            transaction.is_new_user,
            float(transaction.merchant_category in ["électronique", "vêtements"]),  # Catégories à risque
            float(transaction.age < 25 or transaction.age > 65),  # Âge à risque
            float(transaction.transaction_location != transaction.city)  # Transaction hors ville
        ]])

        logger.debug(
            "Preprocessing transaction",
            extra={
                "category": "preprocessing",
                "transaction_id": transaction.transaction_id,
                "user_id": transaction.user_id,
                "bank_id": transaction.banque_id,
                "details": features.tolist()
            }
        )
        return features

    except Exception as e:
        logger.error(
            "Failed to preprocess transaction",
            extra={
                "category": "error",
                "transaction_id": transaction.transaction_id,
                "user_id": transaction.user_id,
                "bank_id": transaction.banque_id,
                "details": {"error": str(e)}
            }
        )
        raise RuntimeError(f"Erreur pendant le prétraitement : {str(e)}")

def predict_fraud(transaction_dict: dict) -> float:
    """
    Prédit la probabilité de fraude pour une transaction.
    
    Args:
        transaction_dict (dict): Données de la transaction sous forme de dictionnaire.
        
    Returns:
        float: Probabilité de fraude (entre 0 et 1).
        
    Raises:
        RuntimeError: Si la prédiction échoue.
    """
    try:
        # Validation et conversion des données d'entrée
        transaction_input = TransactionInput(**transaction_dict)
        features = preprocess_transaction(transaction_input)
        scaled = scaler.transform(features)
        prob_fraud = model.predict_proba(scaled)[0][1]

        logger.info(
            "Fraud prediction completed",
            extra={
                "category": "prediction",
                "transaction_id": transaction_input.transaction_id,
                "user_id": transaction_input.user_id,
                "bank_id": transaction_input.banque_id,
                "details": {"fraud_score": prob_fraud}
            }
        )

        if prob_fraud > 0.8:
            logger.warning(
                "Potential fraud detected",
                extra={
                    "category": "alert",
                    "transaction_id": transaction_input.transaction_id,
                    "user_id": transaction_input.user_id,
                    "bank_id": transaction_input.banque_id,
                    "details": {"fraud_score": prob_fraud}
                }
            )

        return float(prob_fraud)

    except Exception as e:
        logger.error(
            "Fraud prediction failed",
            extra={
                "category": "error",
                "transaction_id": transaction_dict.get("transaction_id", "unknown"),
                "user_id": transaction_dict.get("user_id", "unknown"),
                "bank_id": transaction_dict.get("banque_id", None),
                "details": {"error": str(e)}
            }
        )
        raise RuntimeError(f"Erreur pendant la prédiction : {str(e)}")