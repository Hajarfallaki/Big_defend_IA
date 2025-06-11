# app/services/fraud_detection.py

import joblib
import numpy as np
from app.models.schemas import TransactionInput

# Chargement du modèle et du scaler
model = joblib.load("app/ml_models/fraud_detector.pkl")
scaler = joblib.load("app/ml_models/scaler.pkl")

# Colonnes utilisées dans le modèle factice : transaction_amount + heure
FEATURE_COLUMNS = ["transaction_amount", "hour"]

def preprocess_transaction(transaction: TransactionInput) -> np.ndarray:
    amount = transaction.transaction_amount
    hour = transaction.timestamp.hour  # Extrait l'heure depuis le champ datetime
    return np.array([[amount, hour]])  # Format attendu par le modèle factice

def predict_fraud(transaction_dict: dict) -> float:
    try:
        # Convertit le dictionnaire en TransactionInput (valide les types, convertit automatiquement les dates, etc.)
        transaction_input = TransactionInput(**transaction_dict)

        # Prétraitement (extraire les features nécessaires)
        features = preprocess_transaction(transaction_input)

        # Mise à l’échelle
        scaled = scaler.transform(features)

        # Prédiction de la probabilité de fraude
        prob_fraud = model.predict_proba(scaled)[0][1]
        return float(prob_fraud)

    except Exception as e:
        raise RuntimeError(f"Erreur pendant la prédiction : {str(e)}")
