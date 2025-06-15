# dags/sensor_et_process.py

from airflow import DAG
from airflow.operators.python import PythonOperator
import joblib
from datetime import datetime
import json
from utils.sensor import SimpleKafkaSensor     # importation entre 
import utils.RecupererSauvegarderChargerEnLocal as  charger

# 🔧 Config Kafka
kafka_topic = "transactions"
kafka_config = {
    "bootstrap.servers": "kafka:9092",
    "group.id": "airflow-consumer",
    "auto.offset.reset": "earliest"
}

# 🟢 Tâche de traitement après consommation (sans appel externe)
def process_kafka_message(**context):
    message = context["ti"].xcom_pull(task_ids="wait_for_kafka_message", key="kafka_message")
    if message is None:
        raise ValueError("Aucun message reçu")
    """
    transaction = json.loads(message)
    montant = transaction.get("montant")
    hour = transaction.get("hour")
    """
    transaction = json.loads(message)
    ligne = transaction.get("ligne")

    print("📦 Message consommé depuis Kafka :")
    print(f"➡️ Montant : {ligne}")


    """"
    on fait des prediction :
    """
    
    # on charge le scler 
    scaler_path = "/mlflow/scaler/scaler.joblib"
    scaler = joblib.load(scaler_path) 
    
    X_scaled=scaler.transform(ligne)

    # on charge le mode de puis le local 
    local_xgboost=charger.Charger_depuis_local("/mlflow/localRepos/Xgboost/modele")
    y_xgboost=local_xgboost.predict(X_scaled)
    local_randomforest=charger.Charger_depuis_local("/mlflow/localRepos/RandomForest/modele")
    y_randforest=local_randomforest.predict(X_scaled)
    print("les valuer y_randomforest:")
    print(y_randforest)
    print("les valuer x_randomforest:")
    print(y_xgboost)

    
# 🔄 Définition du DAG
with DAG(
    dag_id="sensor_et_process",
    start_date=datetime(2025, 1, 1),
    schedule_interval=None,
    catchup=False
) as dag:

    
    sensor = SimpleKafkaSensor(
    task_id="wait_for_kafka_message",
    kafka_topic=kafka_topic,
    kafka_config=kafka_config
)

    process = PythonOperator(
        task_id="process_transaction",
        python_callable=process_kafka_message
    )
   
    sensor >> process 
