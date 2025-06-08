# Big Defend AI

## 📖 Description

**Big Defend AI** est une solution avancée de détection de fraudes bancaires en temps réel. Ce système intelligent combine les technologies Big Data, Machine Learning, cybersécurité et intelligence artificielle pour protéger les institutions financières contre les fraudes telles que :

- Usurpation d’identité
- Transactions suspectes
- Blanchiment d’argent
- Fraudes par compromission d’email professionnel (BEC)

---

## 🧩 Fonctionnalités principales

1. **Surveillance continue des comptes**
   - Analyse des connexions anormales (géolocalisation, fréquence, appareil).

2. **Analyse comportementale**
   - Profilage des habitudes utilisateur pour détecter les comportements suspects.

3. **Détection de transactions frauduleuses en temps réel**
   - Algorithmes ML : Isolation Forest, SVM, XGBoost, etc.

4. **Analyse NLP des contenus (emails BEC)**
   - Détection des tentatives de compromission et de virements suspects.

5. **Génération automatique d’alertes de fraude**
   - Envoi d’alertes aux analystes sécurité ou aux clients selon la gravité.

---

## 🏗️ Architecture technique

| Composant           | Technologie                       |
|---------------------|---------------------------------|
| Frontend            | React.js                        |
| Backend             | Python (FastAPI / Flask)        |
| Bases de données    | MongoDB (NoSQL), MySQL          |
| Big Data / Streaming | Apache Kafka, Apache Spark      |
| Sécurité            | JWT, chiffrement AES-256        |
| Machine Learning    | Python (scikit-learn, pandas…)  |

---

## 🚀 Démarrage rapide (Backend)

### Prérequis

- Python 3.8+
- Virtualenv
- Accès aux bases de données MongoDB et MySQL
- Clé JWT pour authentification

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/votreorg/big-defend-ai.git

# Se positionner dans le backend
cd big-defend-ai/backend

# Créer un environnement virtuel et l'activer
python -m venv venv
# Sous Windows
venv\Scripts\activate
# Sous Linux / MacOS
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur (exemple FastAPI)
uvicorn main:app --reload
````

---

## 📁 Structure du projet

```
big-defend-ai/
├── backend/            # Code backend Python (APIs, ML, sécurité)
│   ├── app/
│   ├── venv/           # Environnement virtuel (non versionné)
│   └── requirements.txt
├── frontend/           # Code React.js (interface utilisateur)
├── data/               # Datasets et fichiers de traitement
├── docs/               # Documentation, diagrammes UML
└── scripts/            # Scripts de traitement et déploiement
```

---

## 👥 Équipe et responsabilités

| Membres  | Rôle / Tâches                             |
| -------- | ----------------------------------------- |
| Youssouf | Backend, APIs REST, JWT, base de données  |
| Darius   | Backend, intégration Big Data & streaming |
| Salma    | Frontend React.js, UI/UX                  |
| Alassane | Frontend, dashboard et visualisation      |
| Hajar    | Machine Learning, préparation datasets    |
| Benoît   | Modèles ML, intégration IA dans backend   |

---

## 🔐 Sécurité

* Authentification JWT sécurisée
* Chiffrement AES-256 des données sensibles
* Gestion des rôles : Admin, Analyste, Client

---

## 📄 Livrables

1. Application complète fonctionnelle (démo)
2. Rapport détaillé et documenté (PDF)
3. Présentation PowerPoint
4. Code source disponible sur GitHub

---

## 📞 Contact

Pour toute question ou contribution, merci de contacter l'équipe projet via GitHub.

---

*Ce projet est réalisé dans le cadre du Projet d'innovation, semestre S4 2024-2025.*

