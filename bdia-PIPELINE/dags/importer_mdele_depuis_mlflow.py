from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

from utils.RecupererSauvegarderChargerEnLocal import recuperer_modele_Depuis_mlflow



def recupere():
    recuperer_modele_Depuis_mlflow(modele="Random Forest",chemin_loocal="/mlflow/localRepos/RandomForest/modele")
    recuperer_modele_Depuis_mlflow(modele="XGBoost",chemin_loocal="/mlflow/localRepos/Xgboost/modele")




# Définir le DAG
with DAG(
    dag_id="recuperer_modele_mlflow",
    start_date=datetime(2023, 1, 1),
    schedule_interval=None,
    catchup=False,
    tags=["mlflow", "airflow"]
) as dag:
    
    tache_recuperation = PythonOperator(
        task_id="recuperer_modele",
        python_callable=recupere
    )

    tache_recuperation
