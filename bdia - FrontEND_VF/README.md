# BigDefend AI - Frontend React

## 🚀 Installation et Configuration

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Backend BigDefend AI (optionnel pour le mode démo)

### Installation

1. **Cloner le projet**
```bash
git clone <votre-repo-url>
cd bigdefend-ai-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
Créer un fichier `.env` à la racine :
```env
# URL de votre backend (optionnel pour le mode démo)
VITE_API_URL=http://localhost:8000/api/v1

# Autres configurations
VITE_APP_NAME=BigDefend AI
VITE_APP_VERSION=1.0.0
```

4. **Démarrer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🔐 Connexion

### Mode Démo (Sans Backend)
Utilisez ces identifiants de test :
- **Email :** `admin@bigdefend.ai`
- **Mot de passe :** `password123`

### Mode Production (Avec Backend)
1. Assurez-vous que votre backend BigDefend AI est en cours d'exécution
2. Configurez `VITE_API_URL` dans le fichier `.env`
3. Utilisez vos vrais identifiants d'utilisateur

## 📋 Fonctionnalités

### Pages Disponibles
- **Dashboard** : Vue d'ensemble avec métriques et graphiques
- **Transactions** : Gestion des transactions avec détection de fraude
- **Alertes** : Système d'alertes avec filtrage avancé
- **Analytics** : Analyses avancées et insights
- **Rapports** : Génération et gestion de rapports
- **Utilisateurs** : Gestion des comptes (admin uniquement)
- **Paramètres** : Configuration système (admin uniquement)

### Rôles Utilisateurs
- **Admin** : Accès complet à toutes les fonctionnalités
- **Analyste** : Accès aux transactions, alertes, analytics et rapports
- **Client Banque** : Accès limité aux données de sa banque

## 🛠 Développement

### Structure du Projet
```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages principales
├── services/           # Services API
├── store/              # Gestion d'état (Zustand)
├── routes/             # Configuration des routes
└── styles/             # Styles CSS/Tailwind
```

### Scripts Disponibles
```bash
npm run dev          # Démarrer en mode développement
npm run build        # Construire pour la production
npm run preview      # Prévisualiser la build de production
npm run lint         # Vérifier le code avec ESLint
```

## 🔧 Configuration Backend

Si vous utilisez le backend BigDefend AI, assurez-vous que :

1. **Le backend est démarré** sur le port configuré (par défaut 8000)
2. **CORS est configuré** pour autoriser `http://localhost:5173`
3. **Les endpoints API** correspondent à ceux utilisés dans les services

### Endpoints Principaux
- `POST /auth/jwt/login` - Connexion
- `GET /users/me` - Profil utilisateur
- `GET /transactions/all` - Liste des transactions
- `GET /alerts/all` - Liste des alertes
- `POST /transactions/add` - Ajouter une transaction

## 🚨 Dépannage

### Problèmes Courants

1. **Erreur de connexion API**
   - Vérifiez que `VITE_API_URL` est correctement configuré
   - Assurez-vous que le backend est en cours d'exécution

2. **Problème d'authentification**
   - Vérifiez les identifiants de connexion
   - Effacez le localStorage du navigateur

3. **Erreurs CORS**
   - Configurez CORS sur votre backend pour autoriser l'origine frontend

### Mode Debug
Pour activer les logs de debug, ajoutez dans `.env` :
```env
VITE_DEBUG=true
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les logs de la console du navigateur
3. Vérifiez les logs du backend si applicable

## 🔄 Mise à Jour

Pour mettre à jour le projet :
```bash
git pull origin main
npm install
npm run dev
```