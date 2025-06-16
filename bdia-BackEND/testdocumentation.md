# TEST DOCUMENTATION

### Contexte
- **Backend** : FastAPI, avec des routers pour `alerts`, `transactions`, `credit_card_transaction`, `users`, et `admin` sous `/api/v1`. Authentification via JWT, rôles (`client_banque`, `admin`, `analyste`), et rate limiting.
- **Base de données** : PostgreSQL (données principales), MongoDB (logs).
- **Frontend** : React sur `http://localhost:3000`, configuré pour CORS.
- **Sécurité** : JWT, SlowAPI, CORS, validation Pydantic, hashage bcrypt.
- **Endpoints principaux** (exemples tirés de la doc) :
  - **Auth** : `POST /api/v1/auth/jwt/login`, `POST /api/v1/auth/register`
  - **Transactions** : `POST /api/v1/transactions/add`, `GET /api/v1/transactions/all`
  - **Alertes** : `POST /api/v1/alerts/create`, `GET /api/v1/alerts/all`
  - **Utilisateurs** : `POST /api/v1/users/register`, `GET /api/v1/users/me`
- **Structure des routers** (dans `app/main.py`) :
  ```python
  app.include_router(alerts.router, prefix="/api/v1")
  app.include_router(transaction.router, prefix="/api/v1")
  app.include_router(user.router, prefix="/api/v1")
  app.include_router(credit_card_transaction.router, prefix="/api/v1")
  ```

---

### 1. Tester les endpoints avec Postman

Postman est un outil idéal pour tester les endpoints de l’API BigDefend AI, en particulier avec l’authentification JWT. Voici comment configurer et tester les endpoints.

#### Étape 1 : Configurer Postman
1. **Télécharger Postman** :
   - Si ce n’est pas déjà fait, téléchargez Postman depuis [www.postman.com](https://www.postman.com/downloads/).
   - Créez un compte ou utilisez la version desktop.

2. **Créer une collection** :
   - Ouvrez Postman, cliquez sur **New > Collection**, et nommez-la `BigDefend AI API`.
   - Ajoutez des dossiers pour organiser : `Auth`, `Transactions`, `Alerts`, `Users`.

3. **Configurer les variables d’environnement** :
   - Allez dans **Environments** (à gauche) et créez un environnement nommé `BigDefend Local`.
   - Ajoutez les variables :
     | Variable        | Valeur                     |
     |-----------------|----------------------------|
     | `BASE_URL`      | `http://localhost:8000`    |
     | `TOKEN`         | (vide pour l’instant)      |
   - Enregistrez l’environnement et sélectionnez-le.

#### Étape 2 : Tester l’authentification
1. **Obtenir un token JWT** :
   - Créez une requête dans le dossier `Auth` :
     - **Méthode** : POST
     - **URL** : `{{BASE_URL}}/api/v1/auth/jwt/login`
     - **Headers** : `Content-Type: application/x-www-form-urlencoded`
     - **Body** (form-data) :
       | Clé       | Valeur              |
       |-----------|---------------------|
       | `username`| `admin@example.com` |
       | `password`| `Admin123!`         |
   - Envoyez la requête. Réponse attendue :
     ```json
     {
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "token_type": "bearer"
     }
     ```
   - Copiez l’`access_token`.

2. **Stocker le token** :
   - Dans Postman, allez dans l’onglet **Tests** de la requête et ajoutez ce script pour sauvegarder le token :
     ```javascript
     const response = pm.response.json();
     pm.environment.set("TOKEN", response.access_token);
     ```
   - Réexécutez la requête pour confirmer que `{{TOKEN}}` est défini.

#### Étape 3 : Tester les endpoints protégés
1. **Configurer l’authentification globale** :
   - Dans la collection `BigDefend AI API`, allez dans l’onglet **Authorization**.
   - Sélectionnez **Bearer Token** et entrez `{{TOKEN}}` comme valeur.

2. **Exemple : Ajouter une transaction** (`POST /api/v1/transactions/add`) :
   - Créez une requête dans le dossier `Transactions` :
     - **Méthode** : POST
     - **URL** : `{{BASE_URL}}/api/v1/transactions/add`
     - **Headers** :
       - `Authorization: Bearer {{TOKEN}}`
       - `Content-Type: application/json`
     - **Body** (JSON) :
       ```json
       {
         "transaction_id": "tx_123",
         "banque_id": 1,
         "amount": 1500.00,
         "date": "2025-06-15T20:02:00Z",
         "client_id": "client_123"
       }
       ```
   - Envoyez la requête. Réponse attendue :
     ```json
     {
       "transaction_id": "tx_123",
       "banque_id": 1,
       "amount": 1500.00,
       "date": "2025-06-15T20:02:00Z",
       "client_id": "client_123",
       "fraud_probability": 0.85,
       "is_fraud": true,
       "status": "pending"
     }
     ```
   - Vérifiez les logs dans MongoDB :
     ```bash
     docker exec -it mongodb mongosh
     use bigdefend
     db.logs.find({"extra.category": "transaction"}).pretty()
     ```

3. **Exemple : Lister les alertes** (`GET /api/v1/alerts/all`) :
   - Créez une requête dans le dossier `Alerts` :
     - **Méthode** : GET
     - **URL** : `{{BASE_URL}}/api/v1/alerts/all`
     - **Headers** : `Authorization: Bearer {{TOKEN}}`
   - Envoyez la requête. Réponse attendue :
     ```json
     [
       {
         "id": 1,
         "transaction_id": "tx_123",
         "banque_id": 1,
         "fraud_probability": 0.89,
         "message": "Transaction suspecte détectée",
         "status": "non traité",
         "date": "2025-06-15T20:02:00Z"
       }
     ]
     ```

4. **Exemple : Créer un utilisateur** (`POST /api/v1/users/register`) :
   - Créez une requête dans le dossier `Users` :
     - **Méthode** : POST
     - **URL** : `{{BASE_URL}}/api/v1/users/register`
     - **Headers** : `Authorization: Bearer {{TOKEN}}`
     - **Body** (JSON) :
       ```json
       {
         "nom": "Banque Test",
         "email": "banque@test.com",
         "password": "Test123!",
         "role": "client_banque"
       }
       ```
   - Envoyez la requête. Réponse attendue :
     ```json
     {
       "id": 2,
       "nom": "Banque Test",
       "email": "banque@test.com",
       "role": "client_banque",
       "is_active": true,
       "is_superuser": false,
       "is_verified": true
     }
     ```

5. **Tester les erreurs** :
   - Essayez `POST /api/v1/users/register` sans token ou avec un token invalide :
     - Attendu : `401 Unauthorized` ou `403 Forbidden`.
   - Essayez `POST /api/v1/transactions/add` avec un `amount` négatif :
     - Attendu : `422 Unprocessable Entity` (validation Pydantic).

#### Étape 4 : Exporter la collection
- Exportez la collection Postman pour la partager avec l’équipe :
  - Cliquez sur les trois points à côté de la collection > **Export**.
  - Enregistrez en format JSON (ex. : `BigDefend_API.postman_collection.json`).
- Importez-la sur un autre Postman pour collaborer.

#### Conseils Postman
- **Automatisation** : Créez un script de test dans l’onglet **Tests** pour vérifier les codes de statut :
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  ```
- **Documentation** : Générez une doc depuis Postman (Collection > **Publish Docs**).
- **Rate limiting** : Testez en envoyant 20 requêtes rapides à `POST /api/v1/transactions/add` pour déclencher un `429 Too Many Requests`.

---

### 2. Intégrer les endpoints avec un frontend React

Pour intégrer l’API avec un frontend React (sur `http://localhost:3000`), vous devez :
- Configurer `axios` pour gérer les requêtes avec JWT.
- Gérer l’authentification (login, stockage du token).
- Consommer les endpoints pour les transactions, alertes, et utilisateurs.
- Afficher les données dans des composants React.

#### Étape 1 : Configurer le projet React
1. **Créer une application React** :
   ```bash
   npx create-react-app bigdefend-frontend
   cd bigdefend-frontend
   npm install axios react-router-dom
   npm start
   ```

2. **Structure du frontend** :
   ```
   bigdefend-frontend/
   ├── src/
   │   ├── components/
   │   │   ├── Login.js
   │   │   ├── TransactionForm.js
   │   │   ├── AlertsList.js
   │   │   └── UserProfile.js
   │   ├── services/
   │   │   └── api.js
   │   ├── App.js
   │   ├── index.js
   ├── package.json
   ```

#### Étape 2 : Configurer l’API client
Créez un service `api.js` pour gérer les requêtes avec `axios`.

```javascript
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Endpoints
export const login = async (email, password) => {
  const response = await api.post('/auth/jwt/login', 
    `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const registerUser = async (userData) => {
  return api.post('/users/register', userData);
};

export const getUserProfile = async () => {
  return api.get('/users/me');
};

export const addTransaction = async (transactionData) => {
  return api.post('/transactions/add', transactionData);
};

export const getTransactions = async (banqueId) => {
  return api.get(`/transactions/banque/${banqueId}`);
};

export const getAlerts = async () => {
  return api.get('/alerts/all');
};

export const createAlert = async (alertData) => {
  return api.post('/alerts/create', alertData);
};

export default api;
```
```

#### Étape 3 : Créer le composant Login
```javascript
```javascript
// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
```
```

#### Étape 4 : Créer le composant TransactionForm
```javascript
```javascript
// src/components/TransactionForm.js
import React, { useState } from 'react';
import { addTransaction } from '../services/api';

const TransactionForm = ({ banqueId }) => {
  const [transaction, setTransaction] = useState({
    transaction_id: '',
    amount: '',
    date: new Date().toISOString(),
    client_id: '',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addTransaction({
        ...transaction,
        banque_id: banqueId,
        transaction_id: `tx_${Date.now()}`,
      });
      setMessage(`Transaction ajoutée avec un score de fraude: ${response.data.fraud_probability}`);
    } catch (err) {
      setMessage('Erreur lors de l’ajout de la transaction.');
    }
  };

  return (
    <div>
      <h2>Ajouter une transaction</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={transaction.amount}
          onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
          placeholder="Montant"
          required
        />
        <input
          type="text"
          value={transaction.client_id}
          onChange={(e) => setTransaction({ ...transaction, client_id: e.target.value })}
          placeholder="ID Client"
          required
        />
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default TransactionForm;
```
```

#### Étape 5 : Configurer le routage
Modifiez `App.js` pour inclure les routes.

```javascript
```javascript
// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import TransactionForm from './components/TransactionForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<TransactionForm banqueId={1} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```
```

#### Étape 6 : Tester le frontend
1. **Lancer le backend** :
   ```bash
   docker-compose up -d
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Lancer le frontend** :
   ```bash
   cd bigdefend-frontend
   npm start
   ```

3. **Tester** :
   - Accédez à `http://localhost:3000/login`.
   - Connectez-vous avec `admin@example.com` et `Admin123!`.
   - Redirigez vers `/dashboard` et soumettez une transaction.
   - Vérifiez les logs MongoDB et les alertes PostgreSQL.

#### Conseils React
- **Gestion du token** : Stockez le token dans `localStorage` ou un contexte React pour persister la session.
- **Protection des routes** : Utilisez un composant `PrivateRoute` pour restreindre l’accès :
  ```javascript
  const PrivateRoute = ({ children }) => {
    return localStorage.getItem('token') ? children : <Navigate to="/login" />;
  };
  ```
- **WebSockets** (optionnel) : Pour les alertes en temps réel, implémentez un WebSocket pour écouter les nouvelles alertes (ex. : `ws://localhost:8000/api/v1/alerts/ws`).
- **Erreur 401** : Redirigez vers `/login` si le token expire (géré dans `api.js`).

---

### 3. Comprendre la sécurité des routers

Les routers dans `app/main.py` sont inclus avec `app.include_router` et sécurisés via plusieurs mécanismes. Voici une explication détaillée.

#### Organisation des routers
- **Code dans `main.py`** :
  ```python
  app.include_router(alerts.router, prefix="/api/v1")
  app.include_router(transaction.router, prefix="/api/v1")
  app.include_router(user.router, prefix="/api/v1")
  app.include_router(credit_card_transaction.router, prefix="/api/v1")
  ```
  - Chaque router est défini dans un fichier séparé (`alerts.py`, `transaction.py`, etc.).
  - Le `prefix="/api/v1"` ajoute `/api/v1` à toutes les routes du router (ex. : `alerts.py` avec `@router.post("/create")` devient `/api/v1/alerts/create`).
  - Les routers sont des instances de `fastapi.APIRouter`, qui regroupent des routes liées (ex. : toutes les routes pour les alertes dans `alerts.py`).

- **Exemple de router (`alerts.py`)** :
  ```python
  from fastapi import APIRouter, Depends, HTTPException
  from app.auth.user_manager import current_user, current_superuser
  from app.schemas.alert import AlertCreate, AlertRead, AlertUpdate
  from app.models.alert import Alert

  router = APIRouter(prefix="/alerts", tags=["alerts"])

  @router.post("/create", response_model=AlertRead)
  async def create_alert(alert: AlertCreate, user=Depends(current_user)):
      if user.role not in ["admin", "analyste"]:
          raise HTTPException(status_code=403, detail="Non autorisé")
      # Logique pour créer l’alerte
      return alert

  @router.get("/all", response_model=list[AlertRead])
  async def get_all_alerts(user=Depends(current_user)):
      if user.role not in ["admin", "analyste"]:
          raise HTTPException(status_code=403, detail="Non autorisé")
      # Logique pour lister les alertes
      return []
  ```

#### Mécanismes de sécurité
1. **Authentification JWT** :
   - Chaque endpoint protégé utilise `Depends(current_user)` ou `Depends(current_superuser)` (défini dans `app/auth/user_manager.py`).
   - Exemple :
     ```python
     async def current_user(token: str = Depends(oauth2_scheme)):
         credentials_exception = HTTPException(status_code=401, detail="Invalid token")
         try:
             payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
             email: str = payload.get("sub")
             if email is None:
                 raise credentials_exception
         except JWTError:
             raise credentials_exception
         user = await get_user_by_email(email)
         if user is None:
             raise credentials_exception
         return user
     ```
   - Le token est vérifié dans l’en-tête `Authorization: Bearer <token>`.
   - Si invalide, retourne `401 Unauthorized`.

2. **Vérification des rôles** :
   - Les endpoints restreignent l’accès selon le rôle (`client_banque`, `admin`, `analyste`).
   - Exemple : `POST /api/v1/users/register` nécessite `current_superuser` (seul `admin` avec `is_superuser=True`).
   - Vérification dans le code :
     ```python
     if user.role not in ["admin", "analyste"]:
         raise HTTPException(status_code=403, detail="Non autorisé")
     ```

3. **Rate limiting (SlowAPI)** :
   - Configuré dans `main.py` :
     ```python
     from slowapi import Limiter, _rate_limit_exceeded_handler
     from slowapi.util import get_remote_address

     limiter = Limiter(key_func=get_remote_address)
     app.state.limiter = limiter
     app.add_exception_handler(429, _rate_limit_exceeded_handler)
     ```
   - Exemple dans `transaction.py` :
     ```python
     @router.post("/add")
     @limiter.limit("10/minute")
     async def add_transaction(transaction: TransactionCreate, request: Request, user=Depends(current_user)):
         # Logique
     ```
   - Si plus de 10 requêtes par minute depuis la même IP, retourne `429 Too Many Requests`.

4. **CORS** :
   - Configuré dans `main.py` :
     ```python
     from fastapi.middleware.cors import CORSMiddleware

     app.add_middleware(
         CORSMiddleware,
         allow_origins=["http://localhost:3000"],
         allow_credentials=True,
         allow_methods=["*"],
         allow_headers=["*"],
     )
     ```
   - Autorise le frontend React à envoyer des requêtes avec credentials (tokens).

5. **Validation Pydantic** :
   - Les schémas (`schemas/*.py`) valident les entrées :
     ```python
     # app/schemas/transaction.py
     from pydantic import BaseModel, Field

     class TransactionCreate(BaseModel):
         transaction_id: str
         banque_id: int
         amount: float = Field(gt=0)  # Doit être positif
         date: str
         client_id: str
     ```
   - Si `amount` est négatif, retourne `422 Unprocessable Entity`.

6. **Logs structurés** :
   - Chaque requête/action est loguée dans MongoDB via `app/logging/mongodb_logger.py`.
   - Exemple :
     ```python
     from app.logging.log_setup import logger

     logger.info(
         "Transaction added",
         extra={
             "category": "transaction",
             "user_id": user.id,
             "role": user.role,
             "ip_address": request.client.host,
             "details": {"transaction_id": transaction.transaction_id}
         }
     )
     ```

7. **Chiffrement** :
   - Mots de passe hashés avec `bcrypt` dans `app/auth/hash.py`.
   - Prêt pour un chiffrement supplémentaire (ex. : `sqlalchemy-encrypted`).

#### Pourquoi c’est « super sécurisé » ?
- **JWT** : Protège contre les accès non autorisés.
- **Rôles** : Granularité fine pour limiter les actions.
- **Rate limiting** : Protège contre les abus (ex. : DDoS).
- **CORS** : Restreint les origines aux frontends approuvés.
- **Validation** : Évite les injections et données invalides.
- **Logs** : Permet l’audit et la traçabilité.
- **Chiffrement** : Sécurise les données sensibles.

---

### 4. Recommandations
1. **Postman** :
   - Testez tous les endpoints avec différents rôles (`client_banque`, `admin`, `analyste`).
   - Vérifiez les logs MongoDB après chaque requête.
   - Exportez la collection pour l’équipe.

2. **React** :
   - Implémentez un contexte pour gérer l’état utilisateur :
     ```javascript
     // src/context/AuthContext.js
     import React, { createContext, useState } from 'react';

     export const AuthContext = createContext();

     export const AuthProvider = ({ children }) => {
       const [user, setUser] = useState(null);
       return (
         <AuthContext.Provider value={{ user, setUser }}>
           {children}
         </AuthContext.Provider>
       );
     };
     ```
   - Ajoutez des tests frontend avec `jest` et `react-testing-library`.

3. **Sécurité** :
   - Testez les endpoints avec des tokens expirés/invalides.
   - Vérifiez le rate limiting avec des scripts de stress :
     ```bash
     for i in {1..20}; do curl -X POST "{{BASE_URL}}/api/v1/transactions/add" -H "Authorization: Bearer {{TOKEN}}" -d '{"transaction_id":"tx_test","banque_id":1,"amount":100,"date":"2025-06-15T20:02:00Z","client_id":"client_test"}'; done
     ```
   - Activez HTTPS en production (ex. : avec Nginx).

4. **CI/CD** :
   ```yaml
   name: Test API
   on: [push]
   jobs:
     test:
       runs-on: ubuntu-latest
       services:
         postgres:
           image: postgres:13
           env:
             POSTGRES_USER: admin
             POSTGRES_PASSWORD: secret
             POSTGRES_DB: bigdefend
           ports:
             - 5432:5432
         mongodb:
           image: mongo:5
           ports:
             - 27017:27017
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
           with:
             python-version: "3.9"
         - run: pip install -r requirements.txt
         - run: uvicorn app.main:app --host 0.0.0.0 --port 8000 &
         - run: curl -X POST "http://localhost:8000/api/v1/auth/jwt/login" -H "Content-Type: application/x-www-form-urlencoded" -d "username=admin@example.com&password=Admin123!"
   ```

---

### 5. Réponses à vos questions
- **Comment tester les endpoints avec Postman ?**  
  - Configurez une collection avec des variables (`BASE_URL`, `TOKEN`).
  - Obtenez un token via `POST /api/v1/auth/jwt/login`.
  - Testez les endpoints protégés avec `Authorization: Bearer {{TOKEN}}`.
  - Vérifiez les logs et les erreurs (401, 403, 429).

- **Comment intégrer avec un frontend React ?**  
  - Utilisez `axios` avec un intercepteur pour ajouter le token JWT.
  - Créez des composants pour l’authentification (`Login`), les transactions (`TransactionForm`), et les alertes.
  - Gérez les erreurs (ex. : 401 → redirection vers `/login`).
  - Configurez le routage avec `react-router-dom`.

- **Comment fonctionnent les routers sécurisés ?**  
  - Les routers sont inclus dans `main.py` avec `app.include_router` et préfixés par `/api/v1`.
  - Sécurisés via JWT (`current_user`), vérification des rôles, rate limiting (SlowAPI), CORS, et validation Pydantic.
  - Les logs structurés dans MongoDB assurent l’audit.

---