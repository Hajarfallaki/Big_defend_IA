from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import mlflow
import mlflow.sklearn
from sklearn.linear_model import LinearRegression
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
import pandas as pd

def train_and_log_model():
    # Configuration MLflow
    mlflow.set_tracking_uri("http://mlflow:5000")
    mlflow.set_experiment("linear-regression-exp")

    # Données synthétiques
    X, y = make_regression(n_samples=100, n_features=1, noise=10, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X, y)
    X_train_df = pd.DataFrame(X_train, columns=["feature"])
    X_test_df = pd.DataFrame(X_test, columns=["feature"])

    # Entraînement et log MLflow
    with mlflow.start_run() as run:
        model = LinearRegression()
        model.fit(X_train_df, y_train)
        mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="model",
            registered_model_name="mon_modele_sklearn"
        )
        score = model.score(X_test_df, y_test)
        mlflow.log_metric("r2", score)
        print(f"Modèle loggé - Run ID: {run.info.run_id}")

# Définition du DAG
default_args = {
    'start_date': datetime(2024, 1, 1),
    'catchup': False,
}

with DAG(
    dag_id='train_linear_regression_mlflow',
    schedule_interval=None,  # manuel
    default_args=default_args,
    description='Train and log a linear regression model using MLflow',
    tags=['mlflow', 'linear_regression'],
) as dag:

    train_task = PythonOperator(
        task_id='train_and_log_model',
        python_callable=train_and_log_model
    )

    train_task
