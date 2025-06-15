from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

# Étape 1 : Prétraitement
def preprocess():
    print("Preprocessing data...")

# Étape 2 : Entraînement du modèle
def train_model():
    print("Training model...")

# Étape 3 : Évaluation
def evaluate():
    print("Evaluating model...")

# Définition du DAG
with DAG(
    dag_id='ml_pipeline',
    start_date=datetime(2025, 7,9 ),
    schedule_interval='@daily',
    catchup=False
) as dag:
    t1 = PythonOperator(
        task_id='preprocess',
        python_callable=preprocess
    )
    t2 = PythonOperator(
        task_id='train',
        python_callable=train_model
    )
    t3 = PythonOperator(
        task_id='evaluate',
        python_callable=evaluate
    )

    # Dépendances
    t1 >> t2 >> t3
