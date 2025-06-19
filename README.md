# Big Defend AI

**Big Defend AI** est une solution avancée de détection de fraudes bancaires en temps réel, combinant les technologies Big Data, Machine Learning, cybersécurité, et intelligence artificielle pour protéger les institutions financières contre diverses menaces, telles que l'usurpation d'identité, les transactions suspectes, le blanchiment d'argent, et les fraudes par compromission d'email professionnel (BEC).

Ce projet a été réalisé dans le cadre du **Projet d'Innovation, semestre S4 2024-2025**.

## Table des matières
- [Description](#description)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage rapide](#démarrage-rapide)
- [Pipeline IA/ML](#pipeline-ia/ml)
- [Structure du projet](#structure-du-projet)
- [API principales](#api-principales)
- [Sécurité](#sécurité)
- [Livrables](#livrables)
- [Contributeurs](#contributeurs)
- [Licence](#licence)
- [Contact](#contact)

## Description
Big Defend AI est une plateforme intelligente conçue pour détecter et prévenir les fraudes bancaires en temps réel. Elle utilise des algorithmes de machine learning (XGBoost, Isolation Forest, SVM) pour analyser les transactions, des techniques NLP pour détecter les fraudes par email (BEC), et des technologies Big Data (Kafka, Spark) pour traiter de grands volumes de données. L'interface utilisateur, développée en React, permet une surveillance intuitive des transactions et des alertes de fraude.

## Fonctionnalités principales
- **Surveillance continue des comptes** :
  - Analyse des connexions anormales (géolocalisation, fréquence, appareil).
- **Analyse comportementale** :
  - Profilage des habitudes utilisateur pour détecter les comportements suspects.
- **Détection de transactions frauduleuses en temps réel** :
  - Algorithmes ML (XGBoost, Isolation Forest, SVM) pour identifier les transactions à risque.
- **Analyse NLP des contenus** :
  - Détection des tentatives de compromission d'email professionnel (BEC) via analyse des emails.
- **Génération automatique d'alertes** :
  - Notifications aux analystes ou clients selon la gravité des fraudes détectées.
- **Simulation de transactions** :
  - Génération de transactions classiques ou par carte pour tester les modèles ML.
- **Tableau de bord interactif** :
  - Visualisation en temps réel des transactions, scores de fraude, et statistiques.

## Technologies utilisées
### Backend
- **Framework** : FastAPI (Python)
- **Base de données** : PostgreSQL (relationnelle), MongoDB (NoSQL)
- **Streaming/Big Data** : Apache Kafka, Apache Spark
- **Authentification** : JWT
- **Chiffrement** : AES-256
- **Dépendances** : Poetry
- **Logging** : Python `logging`

### Frontend
- **Framework** : React.js (avec Vite)
- **Styling** : Tailwind CSS
- **Gestion d'état** : Zustand
- **Client HTTP** : Axios
- **Notifications** : React-Hot-Toast
- **Icônes** : Lucide-React

### Pipeline IA/ML
- **Modèles** : XGBoost, Isolation Forest, SVM
- **Preprocessing** : Scikit-learn (StandardScaler), Pandas
- **NLP** : SpaCy, NLTK (pour analyse BEC)
- **Entraînement** : Jupyter Notebooks
- **Déploiement** : Joblib pour sérialisation des modèles

### Infrastructure
- **Base de données** : PostgreSQL, MongoDB
- **Orchestration** : Docker, Docker Compose
- **Migrations** : Alembic (pour PostgreSQL)
- **CI/CD** : GitHub Actions (optionnel)

## Architecture
- **Frontend** : Interface React pour la visualisation des transactions et alertes.
- **Backend** : API FastAPI pour la gestion des utilisateurs, transactions, et prédictions ML.
- **Pipeline IA/ML** : Modèles pré-entraînés (XGBoost, etc.) intégrés au backend pour prédictions en temps réel.
- **Streaming** : Kafka pour le traitement des flux de transactions, Spark pour l'analyse Big Data.
- **Base de données** : PostgreSQL pour les données structurées (transactions, utilisateurs), MongoDB pour les logs et données non structurées (emails BEC).
- **Sécurité** : Authentification JWT, chiffrement AES-256, gestion des rôles.

## Prérequis
- **Python** : 3.8+
- **Node.js** : 18+
- **PostgreSQL** : 13+
- **MongoDB** : 5.0+
- **Apache Kafka** : 3.0+ (optionnel pour streaming)
- **Apache Spark** : 3.2+ (optionnel pour Big Data)
- **Docker** : (optionnel pour déploiement conteneurisé)
- **Poetry** : Pour la gestion des dépendances Python
- **npm** : Pour la gestion des dépendances frontend

## Installation
1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votreorg/big-defend-ai.git
   cd big-defend-ai
   ```

2. **Installer le backend** :
   ```bash
      ### Se positionner dans le backend
      cd big-defend-ai/backend
      
      ### Créer un environnement virtuel et l'activer
      python -m venv venv
      ### Sous Windows
      venv\Scripts\activate
      ### Sous Linux / MacOS
      source venv/bin/activate
      
      ### Installer les dépendances
      pip install -r requirements.txt
      
      # Lancer le serveur (exemple FastAPI)
      uvicorn main:app --reload
   ```

3. **Installer le frontend** :
   ```bash
   cd frontend
   npm install
   ```

4. **Configurer les bases de données** :
   - **PostgreSQL** :
     ```bash
     psql -U postgres
     CREATE DATABASE fraud_detection;
     ```
   - **MongoDB** :
     ```bash
     mongosh
     use fraud_detection
     ```
   - (Optionnel) Utiliser Docker :
     ```bash
     docker-compose up -d
     ```

## Configuration
1. **Backend** :
   Créer un fichier `.env` dans `backend/` :
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/fraud_detection
   MONGO_URL=mongodb://localhost:27017/fraud_detection
   KAFKA_BROKER=localhost:9092
   SECRET_KEY=your_secret_key_here
   ```
   - Générer une clé secrète :
     ```bash
     python -c "import secrets; print(secrets.token_hex(32))"
     ```

2. **Frontend** :
   Créer un fichier `.env` dans `frontend/` :
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. **Migrations de la base de données** :
   ```bash
   cd backend
   alembic upgrade head
   ```

## Démarrage rapide
1. **Lancer le backend** :
   ```bash
   cd backend
   poetry shell
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - API disponible à `http://localhost:8000`
   - Documentation Swagger à `http://localhost:8000/docs`

2. **Lancer le frontend** :
   ```bash
   cd frontend
   npm run dev
   ```
   - Application disponible à `http://localhost:5173`

3. **(Optionnel) Lancer les services avec Docker** :
   ```bash
   docker-compose up -d
   ```

## Pipeline IA/ML
Le pipeline IA/ML est conçu pour détecter les fraudes en temps réel et analyser les emails BEC.

### **Composants**
- **Modèles** :
  - **XGBoost** : Détection des transactions frauduleuses basée sur des features comme le montant, le solde, le type de transaction, etc.
  - **Isolation Forest** : Détection des anomalies dans les comportements transactionnels.
  - **SVM** : Classification des transactions à risque élevé.
  - **NLP (SpaCy/NLTK)** : Analyse des emails pour détecter les tentatives de BEC via des mots-clés suspects et des patterns linguistiques.
- **Features** :
  - **Transactions** : Montant, solde, type (achat, retrait, virement), catégorie du marchand, âge du client, localisation.
  - **Comportement** : Fréquence des connexions, appareil utilisé, géolocalisation.
  - **Emails** : Contenu textuel, métadonnées (expéditeur, destinataire).
- **Preprocessing** :
  - StandardScaler pour normaliser les données numériques.
  - Encodage des variables catégoriques (transaction_type, merchant_category).
  - Tokenisation et vectorisation des emails pour l'analyse NLP.
- **Stockage** :
  - Modèles pré-entraînés : `backend/app/ml_models/XGBoost.pkl`, `scaler.pkl`
  - Données d'entraînement : `data/datasets/`

### **Entraînement**
1. Préparer les données dans `data/datasets/` (CSV pour transactions, JSON pour emails).
2. Exécuter le script d'entraînement :
   ```bash
   cd backend
   python app/ml_models/train_model.py
   ```
3. Les modèles mis à jour sont sauvegardés dans `app/ml_models/`.

### **Déploiement**
- Les modèles sont chargés dans `app/services/fraud_detection.py` via Joblib.
- Les prédictions sont intégrées dans l'API `/transactions/add` pour les transactions classiques et `/transactions/add-card` pour les transactions par carte.

### **Exemple de prédiction**
```python
from app.services.fraud_detection import predict_fraud

transaction = {
    "customer_id": 4457,
    "customer_name": "Mohammed Alami",
    "gender": "M",
    "age": 30,
    "state": "Casablanca",
    "city": "Casablanca",
    "bank_branch": "Centre",
    "account_type": "courant",
    "transaction_id": "123456789",
    "transaction_date": "2025-06-17T10:00:00",
    "transaction_time": "10:00:00",
    "transaction_amount": 100.50,
    "merchant_id": 123,
    "transaction_type": "achat",
    "merchant_category": "vêtements",
    "account_balance": 1000.0,
    "transaction_device": "mobile",
    "transaction_location": "Casablanca",
    "device_type": "Android",
    "transaction_currency": "MAD",
    "customer_contact": "0612345678",
    "transaction_description": "Achat vêtements",
    "customer_email": "mohammed.alami@email.com",
    "banque_id": 1,
    "user_id": "1",
    "transaction_category": "vêtements",
    "balance_change": 100.50,
    "is_new_user": 0
}
score = predict_fraud(transaction)
print(f"Fraud Probability: {score}")
```

## Structure du projet
```
big-defend-ai/
├── backend/                    # Code backend (FastAPI, ML)
│   ├── app/
│   │   ├── core/              # Configuration, base de données
│   │   ├── models/            # Modèles SQLAlchemy
│   │   ├── schemas/           # Schémas Pydantic
│   │   ├── services/          # Logique métier (fraud_detection.py)
│   │   ├── routers/           # Endpoints API
│   │   └── ml_models/         # Modèles ML (XGBoost.pkl, scaler.pkl)
│   ├── alembic/               # Migrations PostgreSQL
│   └── requirements.txt        # Dépendances Python
├── frontend/                   # Code frontend (React)
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── services/          # Services API (Axios)
│   │   └── store/             # Gestion d'état (Zustand)
│   └── package.json
├── data/                      # Datasets pour l'entraînement ML
├── docs/                      # Documentation (diagrammes UML, rapport)
├── scripts/                   # Scripts d'automatisation et déploiement
└── docker-compose.yml         # Configuration Docker
```

## API principales
- **POST /auth/register** : Inscription d'un utilisateur.
- **POST /auth/jwt/login** : Connexion avec JWT.
- **POST /transactions/add** : Créer une transaction classique.
- **POST /transactions/add-card** : Créer une transaction par carte.
- **GET /transactions** : Lister toutes les transactions (admin/analyste).
- **GET /transactions/bank/{bank_id}** : Lister les transactions d'une banque.
- **GET /alerts** : Lister les alertes de fraude.

Exemple de requête `POST /transactions/add` :
```json
{
  "customer_id": 4457,
  "customer_name": "Mohammed Alami",
  "gender": "M",
  "age": 30,
  "state": "Casablanca",
  "city": "Casablanca",
  "bank_branch": "Centre",
  "account_type": "courant",
  "transaction_id": "123456789",
  "transaction_date": "2025-06-17T10:00:00Z",
  "transaction_time": "10:00:00",
  "transaction_amount": 100.50,
  "merchant_id": 123,
  "transaction_type": "achat",
  "merchant_category": "vêtements",
  "account_balance": 1000.0,
  "transaction_device": "mobile",
  "transaction_location": "Casablanca",
  "device_type": "Android",
  "transaction_currency": "MAD",
  "customer_contact": "0612345678",
  "transaction_description": "Achat vêtements",
  "customer_email": "mohammed.alami@email.com",
  "banque_id": 1,
  "user_id": "1",
  "transaction_category": "vêtements",
  "balance_change": 100.50,
  "is_new_user": 0
}
```

## Sécurité
- **Authentification** : JWT pour sécuriser les endpoints.
- **Chiffrement** : AES-256 pour les données sensibles.
- **Gestion des rôles** : Admin (gestion complète), Analyste (alertes, rapports), Client (transactions limitées).
- **Rate Limiting** : FastAPI-Limiter avec Redis pour prévenir les abus.

## Livrables
- **Application fonctionnelle** : Démo disponible via l'interface React.
- **Rapport détaillé** : Document PDF expliquant l'architecture, les choix techniques, et les résultats.
- **Présentation** : Diapositives PowerPoint pour la soutenance.
- **Code source** : Disponible sur GitHub.

## Contributeurs
- **Youssouf** ([@YoussoufHard](https://github.com/YoussoufHard))
- **Salma** ([@SalmaFennan](https://github.com/SalmaFennan))
- **Hajar** ([@Hajarfallaki](https://github.com/Hajarfallaki))
- **Alassane** ([@Alasko25](https://github.com/Alasko25))
- **Benoît** ([@Believer2001](https://github.com/Believer2001))
- **Darius** ([@darius-konsebo](https://github.com/darius-konsebo))

## Licence
Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact
Pour toute question ou contribution, ouvrez une issue sur GitHub ou contactez l'équipe via [GitHub Issues](https://github.com/votreorg/big-defend-ai/issues).

---
