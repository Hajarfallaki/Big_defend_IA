from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime



import pandas as pd
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import mlflow
import joblib
import os

# Importation de fonctions externes
from utils.preprocessing import nettoyer_donnees
from utils.operation_dao_mysql import sauvegarder_mysql

#normalement 





def evaluate_model_with_confusion(model, X, y, cv, model_name="model"):
    accuracies, precisions, recalls, f1s, roc_aucs = [], [], [], [], []
    last_cm = None

    for fold_idx, (train_idx, test_idx) in enumerate(cv.split(X, y)):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]

        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

        accuracies.append(accuracy_score(y_test, y_pred))
        precisions.append(precision_score(y_test, y_pred))
        recalls.append(recall_score(y_test, y_pred))
        f1s.append(f1_score(y_test, y_pred))
        roc_aucs.append(roc_auc_score(y_test, y_prob))

        # Conserver la dernière matrice de confusion
        if fold_idx == cv.get_n_splits() - 1:
            last_cm = confusion_matrix(y_test, y_pred)

    # 🔽 Logger dans MLflow APRÈS la boucle de validation croisée
    mlflow.set_tracking_uri("http://mlflow:5000")

    with mlflow.start_run(run_name=f"Evaluation {model_name}"):

        mlflow.log_param("model", model_name)

        # 📊 Moyennes des scores
        mlflow.log_metric("accuracy_mean", np.mean(accuracies))
        mlflow.log_metric("accuracy_std", np.std(accuracies))
        mlflow.log_metric("precision_mean", np.mean(precisions))
        mlflow.log_metric("recall_mean", np.mean(recalls))
        mlflow.log_metric("f1_score_mean", np.mean(f1s))
        mlflow.log_metric("roc_auc_mean", np.mean(roc_aucs))

        # 📌 Matrice de confusion
        if last_cm is not None:
            plt.figure(figsize=(5, 4))
            sns.heatmap(last_cm, annot=True, fmt='d', cmap='Blues', cbar=False)
            plt.title(f'Matrice de confusion - {model_name}')
            plt.xlabel('Prédiction')
            plt.ylabel('Réel')

            fig_path = f"{model_name}_confusion_matrix.png"
            plt.savefig(fig_path)
            mlflow.log_artifact(fig_path)
            plt.close()

         # 💾 Enregistrement du modèle dans le Model Registry
        if model_name=="XGBoost": 
            mlflow.xgboost.log_model(
             model,
             artifact_path="model",
             registered_model_name=model_name
             )
        else :
            mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="model",
            registered_model_name=model_name  # Attention à l’unicité
           )




def traitement_et_entrainement():
  
    # 1. Charger les données
    path='/opt/airflow/dags/Data/Bank_Transaction_Fraud_Detection_FE.csv'
    df = pd.read_csv(path,nrows=1000)
    df = nettoyer_donnees(df=df)
    df = df.dropna(subset=['Is_Fraud'])

    # 2. Séparer X et y
    X = df.drop('Is_Fraud', axis=1)
    y = df['Is_Fraud']
    
    
    # 3. Supprimer colonnes non numériques (IDs, UUID, etc.)
    non_numeric_cols = X.select_dtypes(exclude=['number']).columns
    X = X.drop(columns=non_numeric_cols)
   
    ## on fait la sauvegarde pour eviter que les avant la normalisation 
    data= X+y
    

    user = 'ton_utilisateur'
    password = 'rootpassword'
    host = 'localhost'  # ou IP du serveur MySQL
    port = '3306'
    database = 'dataset'
    nom_table='dataset_table'

    """"sauvegarder_mysql(user=user,
                      password=password,
                      host=host,
                      port=port,
                      df=data,
                      nom_table=nom_table,
                      database=database)
    
"""
    # 4. Normalisation

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    path_scaler = "/mlflow/scaler"
    os.makedirs(path_scaler, exist_ok=True)  # Crée le dossier s’il n’existe pas

   # Enregistrement du scaler
    save_path = os.path.join(path_scaler, "scaler.joblib")
    joblib.dump(scaler, save_path)

    print(f"✅ Scaler enregistré dans : {save_path}")
    

    # 5. Rééquilibrage avec SMOTE
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

    # 6. Préparer la validation croisée stratifiée
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
     
   
    # 7. Initialiser les modèles (sans use_label_encoder pour éviter warning)
    models = {
    "Random Forest": RandomForestClassifier(random_state=42),
    "XGBoost": XGBClassifier(eval_metric='logloss', random_state=42)
      }
    # 9. Lancer l'évaluation
    for name, model in models.items():
       print(f"Évaluation du modèle : {name}")
       evaluate_model_with_confusion(model, X_resampled, y_resampled, skf,name)


 
default_args = {'start_date': datetime(2025, 1, 1)}




with DAG("entrainement_pipeline",
         schedule_interval="@daily",
         default_args=default_args,
         catchup=False) as dag:

    entrainement_task = PythonOperator(
        task_id="traitement_et_entrainement",
        python_callable=traitement_et_entrainement
    )


