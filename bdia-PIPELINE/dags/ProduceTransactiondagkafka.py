# dags/produce_transaction_dag.py

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
from confluent_kafka import Producer
import json

# 🟢 Fonction de production Kafka
def produce_transaction():
    x=[[ 60 ,1 ,  -2733.888137,1  ,0.434772,10,14]]

    """"
    transaction = {
        "montant": 200,
        "hour": 14
     }

     """
    transaction = {
        "ligne": x
     }
    producer = Producer({'bootstrap.servers': 'kafka:9092'})
    producer.produce("transactions", json.dumps(transaction).encode('utf-8'))
    producer.flush()
    print("✅ Message produit vers Kafka :", transaction)

# 🔄 Définition du DAG
with DAG(
    dag_id="produce_transaction",
    start_date=datetime(2025, 1, 1),
    schedule_interval=None,
    catchup=False
) as dag:

    produce_task = PythonOperator(
        task_id="produce_kafka_message",
        python_callable=produce_transaction
    )
    
   

    
    produce_task 