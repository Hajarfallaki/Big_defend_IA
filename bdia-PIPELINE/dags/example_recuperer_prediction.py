from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import mlflow.pyfunc
import pandas as pd
import numpy as np


### permet de fairles recuperation depuis mlflow

def predict():
    # URI du modèle en Production
    model_uri = "models:/mon_modele_sklearn/Production"
    # Chargement du modèle depuis MLflow
    model = mlflow.pyfunc.load_model(model_uri)
    
    # Données simulées avec une seule feature (le modèle attend une colonne "feature")
    X_new = pd.DataFrame(np.array([[1.5], [2.5], [3.5]]), columns=["feature"])
    
    # Prédiction
    predictions = model.predict(X_new)
    
    # Affichage
    print("Prédictions :", predictions.tolist())

# Définition du DAG
with DAG(
    dag_id="predict_model_only",
    start_date=datetime(2025, 6, 13),
    schedule_interval=None,
    catchup=False,
    tags=["mlflow", "prediction"]
) as dag:

    predict_task = PythonOperator(
        task_id="predict_task",
        python_callable=predict
    )
