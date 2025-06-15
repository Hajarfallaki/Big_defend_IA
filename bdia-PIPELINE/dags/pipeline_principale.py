# airflow_kafka_pipeline.py
from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.operators.dummy import DummyOperator
from datetime import datetime
import json
import joblib
import pandas as pd
from kafka import KafkaConsumer

MODEL_PATH = "/opt/airflow/models/mon_modele/model.joblib"
KAFKA_TOPIC = "raw_data"
KAFKA_SERVER = "kafka:9092"

# Fonction 1: Consommer un message Kafka (entrée à prédire)
def consommer_donnee_kafka(**kwargs):
    consumer = KafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=[KAFKA_SERVER],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='airflow-group'
    )
    for message in consumer:
        data = json.loads(message.value.decode('utf-8'))
        kwargs['ti'].xcom_push(key='donnee_kafka', value=data)
        break  # une seule donnée par run

# Fonction 2: Faire la prédiction
def faire_prediction(**kwargs):
    data = kwargs['ti'].xcom_pull(key='donnee_kafka')
    modele = joblib.load(MODEL_PATH)
    df = pd.DataFrame([data])
    prediction = modele.predict(df)[0]
    kwargs['ti'].xcom_push(key='prediction', value=prediction)

# Fonction 3: Vérifier s'il y a drift (simplifié ici)
def detecter_drift(**kwargs):
    # TODO: implémenter une vraie vérification de drift (e.g. avec Alibi-detect)
    import random
    drift_detecte = random.choice([True, False])
    return 'entrainement_si_drift' if drift_detecte else 'log_prediction'

# Fonction 4: Réentraîner le modèle
# (Mock ici - tu dois connecter à tes données réelles)
def entrainer_modele():
    from sklearn.datasets import load_iris
    from sklearn.ensemble import RandomForestClassifier
    iris = load_iris()
    model = RandomForestClassifier()
    model.fit(iris.data, iris.target)
    joblib.dump(model, MODEL_PATH)

# Fonction 5: Enregistrer logs ou dashboard
# (par exemple, stocker dans une BDD)
def enregistrer_logs(**kwargs):
    data = kwargs['ti'].xcom_pull(key='donnee_kafka')
    prediction = kwargs['ti'].xcom_pull(key='prediction')
    print(f"Log prédiction - Donnée: {data}, Résultat: {prediction}")

# Définir le DAG
with DAG(
    dag_id="ml_prediction_kafka_pipeline",
    schedule_interval=None,
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=["ml", "kafka", "drift"]
) as dag:

    t1 = PythonOperator(
        task_id="consommer_kafka",
        python_callable=consommer_donnee_kafka
    )

    t2 = PythonOperator(
        task_id="faire_prediction",
        python_callable=faire_prediction
    )

    t3 = BranchPythonOperator(
        task_id="verifier_drift",
        python_callable=detecter_drift
    )

    t4a = PythonOperator(
        task_id="entrainement_si_drift",
        python_callable=entrainer_modele
    )

    t4b = PythonOperator(
        task_id="log_prediction",
        python_callable=enregistrer_logs
    )

    t_fin = DummyOperator(task_id="fin")

    t1 >> t2 >> t3
    t3 >> t4a >> t_fin
    t3 >> t4b >> t_fin
