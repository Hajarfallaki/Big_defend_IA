import mlflow
import mlflow.pyfunc
import tempfile
import shutil
import os

def recuperer_modele_Depuis_mlflow(modele, chemin_loocal):
    mlflow.set_tracking_uri("http://mlflow:5000")

    nom_modele = modele
    stage = "Production"
    model_uri = f"models:/{nom_modele}/{stage}"

    # ➤ Supprimer l'ancien dossier s’il existe
    if os.path.exists(chemin_loocal):
        shutil.rmtree(chemin_loocal)

    # ➤ Télécharger dans un dossier temporaire
    temp_dir = tempfile.mkdtemp()
    temp_model_path = mlflow.artifacts.download_artifacts(artifact_uri=model_uri, dst_path=temp_dir)

    # ➤ Copier vers le chemin désiré
    shutil.copytree(temp_model_path, chemin_loocal)

    print(f"✅ Modèle récupéré dans : {chemin_loocal}")


def Charger_depuis_local(chemin):
   # Charger le modèle depuis le dossier sauvegardé
   path= chemin
   loaded_model = mlflow.pyfunc.load_model(path)

   # Exemple de prédiction

   print("modele charger ")

   return loaded_model

