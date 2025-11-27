# 🏋️ FlowFit - Application de Sport à la Maison

Application web moderne pour gérer vos entraînements à domicile : **Musculation**, **Yoga** et **Mobilité**.

## ✨ Fonctionnalités

- Création de séances personnalisées avec builder drag & drop
- Bibliothèque d'exercices avec catégorisation
- Système de notation (0-5 étoiles) et favoris
- Timer intégré avec temps de repos personnalisables
- Lecteur de séances avec progression en temps réel
- Partage communautaire d'exercices et séances
- Interface dark responsive (desktop, tablette, mobile)

---

## 🚀 Technologies

**Frontend** : React 19, TypeScript, TanStack Router/Query, Tailwind CSS 4, Zustand, Vite  
**Backend** : Node.js, Express 5, PostgreSQL, Sequelize ORM, JWT, Bcrypt, Multer

---

## 📦 Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+

### Installation rapide

```bash
# 1. Cloner et installer
git clone https://github.com/votre-username/FlowFit.git
cd FlowFit
npm run install:all

# 2. Créer la base de données
createdb FlowFit

# 3. Configurer les variables d'environnement
# Backend (.env)
DB_NAME=FlowFit
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
PORT=4000

# Frontend (.env)
VITE_API_URL=http://localhost:4000/api

# 4. Démarrer l'application
npm start
```

**URLs** : Frontend http://localhost:5173 | Backend http://localhost:4000

---

## 🏗️ Architecture

### Structure du projet

```
backend/
├── config/          # DB + Multer
├── controllers/     # Auth, Exercices, Séances
├── middleware/      # Protection JWT
├── models/          # User, Exercise, Session, SessionExercise, SessionRating, FavoriteSession
├── routes/          # Routes API
└── uploads/         # Images (exercices, séances, profils)

frontend/
├── components/      # CircularTimer, Header, MobileNav, SessionBuilder, SessionCard...
├── hooks/           # Custom hooks (15+)
├── pages/           # Pages principales
├── routes/          # TanStack Router
├── services/        # API (auth, exercises, sessions)
└── stores/          # Zustand (auth)
```

### Modèles de base de données

**User** : id, username, email, password (hashed), profileImage  
**Exercise** : id, name, description, category, subcategory, image, createdBy, isShared  
**Session** : id, name, description, category, duration, difficulty, restTime, rating, ratingCount, isShared, createdBy  
**SessionExercise** : sessionId, exerciseId, order, duration (table de liaison)  
**SessionRating** : userId, sessionId, rating  
**FavoriteSession** : userId, sessionId

---

## 🌐 API Endpoints

Toutes les routes protégées nécessitent `Authorization: Bearer <token>`

### Auth (`/api/auth`)

- `POST /register` - Créer un compte
- `POST /login` - Se connecter
- `GET /me` 🔒 - Profil actuel
- `POST /update-profile` 🔒 - Modifier profil

### Exercices (`/api/exercises`)

- `GET /` 🔒 - Tous les exercices (filtres: category, subcategory)
- `GET /community` 🔒 - Exercices partagés
- `GET /my-exercises` 🔒 - Mes exercices
- `GET /:id` 🔒 - Détails
- `POST /` 🔒 - Créer
- `PUT /:id` 🔒 - Modifier
- `DELETE /:id` 🔒 - Supprimer
- `POST /:id/toggle-share` 🔒 - Partager/départager

### Séances (`/api/sessions`)

- `GET /` 🔒 - Toutes les séances (filtres: category, difficulty)
- `GET /my-sessions` 🔒 - Mes séances
- `GET /favorites` 🔒 - Mes favoris
- `GET /:id` 🔒 - Détails
- `POST /` 🔒 - Créer
- `PUT /:id` 🔒 - Modifier
- `DELETE /:id` 🔒 - Supprimer
- `POST /:id/rate` 🔒 - Noter (1-5)
- `POST /:id/favorite` 🔒 - Ajouter aux favoris
- `DELETE /:id/favorite` 🔒 - Retirer des favoris
- `POST /:id/toggle-share` 🔒 - Partager/départager

---

## 🚦 Scripts

```bash
# Racine
npm start           # Démarrer backend + frontend
npm run install:all # Installer toutes les dépendances
npm run db:create   # Créer la base de données

# Backend
npm run server      # Démarrer avec nodemon

# Frontend
npm run dev         # Mode développement
npm run build       # Build de production
```

---

## 📄 Licence

MIT © 2025 FlowFit Team
