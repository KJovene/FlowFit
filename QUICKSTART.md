# 🚀 FlowFit - Guide de Démarrage Rapide

## Installation en 5 Minutes

### 1️⃣ Cloner et Installer

```bash
# Aller dans le dossier du projet
cd /Users/kevin/Desktop/Projets/FlowFit

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

### 2️⃣ Configurer PostgreSQL

```bash
# Option A: Créer la DB via terminal
createdb FlowFit

# Option B: Via psql
psql -U postgres
CREATE DATABASE "FlowFit";
\q
```

### 3️⃣ Configurer les Variables d'Environnement

**Backend** (`backend/.env`):

```env
DB_NAME=FlowFit
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=4000
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:4000/api
```

### 4️⃣ Lancer l'Application

```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend (nouveau terminal)
cd frontend
npm run dev
```

### 5️⃣ Accéder à l'Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Status DB**: Voir terminal backend pour confirmation connexion

## ✅ Checklist de Vérification

Après démarrage, vérifiez:

- [ ] Backend affiche "✅ PostgreSQL DB Connected (FlowFit)"
- [ ] Backend affiche "✅ Database synchronized"
- [ ] Frontend accessible sur localhost:5173
- [ ] Page d'accueil s'affiche correctement
- [ ] Navigation fonctionne (Header)
- [ ] Aucune erreur console

## 🎯 Premier Test

### Test 1: Créer un Compte

1. Aller sur http://localhost:5173
2. Cliquer "Créer un compte" (ou aller sur `/register`)
3. Remplir le formulaire:
   - Username: `test`
   - Email: `test@test.com`
   - Password: `123456`
4. Valider → Redirection vers `/`
5. Vérifier dans Header: le token est stocké

### Test 2: Explorer les Espaces

1. Cliquer "Programmes" dans le Header
2. Cliquer sur "Ouvrir l'espace" pour Musculation
3. Voir la liste des 6 séances
4. Hover sur une carte → bouton "Démarrer" apparaît

### Test 3: Calendrier

1. Aller sur `/calendar`
2. Voir la semaine avec 3 jours complétés
3. Voir la progression 3/5
4. Voir les badges (1 débloqué, 2 verrouillés)

### Test 4: Profil

1. Cliquer "Profil" dans la navigation mobile
2. Voir les stats utilisateur
3. Cliquer "Déconnexion"
4. Vérifier redirection vers `/login`

## 🔧 Dépannage Rapide

### Problème: Backend ne démarre pas

```bash
# Vérifier que PostgreSQL tourne
pg_isready

# Si non actif, démarrer
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Problème: "Database does not exist"

```bash
# Recréer la base
dropdb FlowFit  # Si existe déjà
createdb FlowFit
```

### Problème: Port 4000 déjà utilisé

```bash
# Trouver le processus
lsof -i :4000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans backend/.env
PORT=4001
```

### Problème: Port 5173 déjà utilisé

```bash
# Vite utilisera automatiquement 5174
# Ou spécifier un port
npm run dev -- --port 3000
```

### Problème: Erreur CORS

Vérifier dans `backend/server.js`:

```javascript
app.use(cors()); // Doit être présent
```

### Problème: JWT invalide

```bash
# Vider localStorage
# Dans DevTools Console:
localStorage.clear()
# Puis recharger la page
```

## 📊 Vérification Base de Données

### Voir les tables créées

```sql
psql -U postgres -d FlowFit

-- Lister les tables
\dt

-- Voir les users
SELECT * FROM "Users";

-- Voir les exercises
SELECT * FROM "Exercises";

-- Quitter
\q
```

### Réinitialiser la DB

```bash
# Drop et recréer
dropdb FlowFit
createdb FlowFit

# Redémarrer le backend (auto-sync)
cd backend
npm run server
```

## 🎨 Commandes Utiles

### Backend

```bash
# Dev avec auto-reload
npm run server

# Production
npm start

# Installer nouvelle dépendance
npm install <package>
```

### Frontend

```bash
# Dev avec hot reload
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linter
npm run lint

# Installer nouvelle dépendance
npm install <package>
```

## 🔐 Test API avec cURL

### Register

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Exercises (avec token)

```bash
# Remplacer YOUR_TOKEN par le token reçu au login
curl http://localhost:4000/api/exercises \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🌟 Prochaines Actions

Après installation réussie, vous pouvez:

1. **Personnaliser le Design**

   - Modifier `frontend/src/index.css`
   - Ajuster les couleurs dans les composants

2. **Ajouter des Exercices**

   - Utiliser POST `/api/exercises`
   - Upload d'images via Multer

3. **Créer des Fonctionnalités**

   - Timer de séance
   - Système de streak
   - Notifications

4. **Optimiser**
   - Ajouter React Query
   - Mettre en cache
   - Lazy loading

## 📱 Test Mobile

```bash
# Exposer sur le réseau local
cd frontend
npm run dev -- --host

# Accéder depuis mobile
# http://[votre-ip-locale]:5173
```

## 🎉 C'est Parti !

Votre application FlowFit est maintenant prête à l'emploi !

**URLs à bookmarker**:

- 🏠 App: http://localhost:5173
- 🔧 API: http://localhost:4000
- 📚 Docs Routes: `ROUTES.md`
- ✅ Checklist: `INTEGRATION_COMPLETE.md`

Bon développement ! 💪🧘🤸
