import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

# Récupère les variables d'environnement avec valeurs par défaut
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "bigdefend_logs")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "logs")

client = None
collection = None

def init_mongo():
    global client, collection
    try:
        client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)  # timeout 5s
        # Forcer la connexion (ping)
        client.admin.command('ping')
        db = client[MONGO_DB_NAME]
        collection = db[MONGO_COLLECTION_NAME]
        print(f"✅ MongoDB connecté à {MONGO_URL}, base: {MONGO_DB_NAME}, collection: {MONGO_COLLECTION_NAME}")
    except Exception as e:
        print(f"❌ Échec connexion MongoDB: {e}")
        collection = None


# Initialise la connexion MongoDB au démarrage du module
init_mongo()
