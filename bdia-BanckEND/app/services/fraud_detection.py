# app/services/fraud_detection.py
import joblib
import numpy as np
from app.models.schemas import TransactionInput

# Chargement du modèle et du scaler
model = joblib.load("app/ml_models/fraud_detector.pkl")
scaler = joblib.load("app/ml_models/scaler.pkl")

# Colonnes utilisées dans le modèle
FEATURE_COLUMNS = ["montant", "hour"]  # ✅ supprimé location_code

def preprocess_transaction(transaction: TransactionInput) -> np.ndarray:
    montant = transaction.montant
    hour = transaction.date.hour  # ✅ accède directement à l'heure

    return np.array([[montant, hour]])  # ✅ on reste cohérent avec le modèle factice

def predict_fraud(transaction_dict: dict) -> float:
    try:
        transaction_input = TransactionInput(**transaction_dict)
        features = preprocess_transaction(transaction_input)
        scaled = scaler.transform(features)
        prob_fraud = model.predict_proba(scaled)[0][1]  # probabilité de fraude
        return float(prob_fraud)
    except Exception as e:
        raise RuntimeError(f"Erreur pendant la prédiction : {str(e)}")
