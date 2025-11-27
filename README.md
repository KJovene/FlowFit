# FlowFit - Application de Sport à la Maison

FlowFit est une application web moderne pour gérer vos entraînements à la maison, combinant **Musculation**, **Yoga** et **Mobilité** dans une interface élégante et intuitive.

## 🎨 Design

L'application utilise un thème sombre moderne avec des dégradés sky/blue/cyan, optimisé pour le web et mobile.

## 🚀 Technologies

### Frontend

- **React 19** avec TypeScript
- **TanStack Router** pour le routing
- **TanStack Query** pour la gestion des données
- **Tailwind CSS v4** pour le styling
- **Zustand** pour la gestion d'état
- **Lucide React** pour les icônes
- **Vite** comme bundler

### Backend

- **Node.js** avec Express
- **PostgreSQL** avec Sequelize ORM
- **JWT** pour l'authentification
- **Bcrypt** pour le hashage des mots de passe
- **Multer** pour l'upload de fichiers

## 📦 Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Configuration de la base de données PostgreSQL

```bash
# Créer la base de données PostgreSQL
createdb FlowFit

# Ou via psql
psql -U postgres
CREATE DATABASE "FlowFit";
\q
```

### 2. Installation du Backend

```bash
cd backend
npm install

# Configurer les variables d'environnement
# Éditez le fichier .env avec vos informations PostgreSQL
# DB_NAME=FlowFit
# DB_USER=postgres
# DB_PASSWORD=votre_mot_de_passe
# DB_HOST=localhost
# DB_PORT=5432

# Démarrer le serveur
npm run server
```

Le backend sera accessible sur `http://localhost:4000`

### 3. Installation du Frontend

```bash
cd frontend
npm install

# Le fichier .env est déjà configuré avec l'URL du backend
# VITE_API_URL=http://localhost:4000/api

# Démarrer l'application
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 🏗️ Structure du Projet

```
FlowFit/
├── backend/
│   ├── config/
│   │   ├── db.js              # Configuration PostgreSQL/Sequelize
│   │   └── multer.js          # Configuration upload fichiers
│   ├── controllers/
│   │   ├── authController.js  # Logique authentification
│   │   └── exerciseController.js
│   ├── middleware/
│   │   └── auth.js            # Middleware JWT
│   ├── models/
│   │   ├── User.js            # Modèle Sequelize User
│   │   └── Exercise.js        # Modèle Sequelize Exercise
│   ├── routes/
│   │   ├── auth.js
│   │   └── exercises.js
│   ├── uploads/
│   │   └── exercises/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── MobileNav.tsx
    │   │   ├── WorkoutCard.tsx
    │   │   └── SessionCard.tsx
    │   ├── routes/
    │   │   ├── __root.tsx      # Layout principal
    │   │   ├── index.tsx        # Page d'accueil
    │   │   ├── calendar.tsx     # Calendrier & rewards
    │   │   ├── programmes.tsx
    │   │   ├── musculation.tsx
    │   │   ├── yoga.tsx
    │   │   ├── mobilite.tsx
    │   │   ├── login.tsx
    │   │   └── register.tsx
    │   ├── services/
    │   │   ├── auth.ts
    │   │   └── exercises.ts
    │   ├── stores/
    │   │   └── authStore.ts
    │   ├── lib/
    │   │   └── utils.ts
    │   ├── index.css            # Styles Tailwind + customs
    │   └── main.tsx
    ├── .env
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🎯 Fonctionnalités Principales

### Pages Créées

1. **Page d'accueil (`/`)**

   - Hero section avec présentation des 3 espaces
   - Cartes d'aperçu des séances
   - Mockup mobile interactif
   - Statistiques en temps réel

2. **Calendrier (`/calendar`)**

   - Vue hebdomadaire
   - Séances complétées
   - Système de rewards et badges
   - Progression vers l'objectif

3. **Espaces d'entraînement**

   - `/musculation` - Séances de force
   - `/yoga` - Flows et méditation
   - `/mobilite` - Routines de mobilité
   - Filtres par type d'équipement

4. **Authentification**

   - `/login` - Connexion
   - `/register` - Inscription
   - Gestion JWT et localStorage

5. **Programmes (`/programmes`)**
   - Vue d'ensemble des 3 espaces
   - Recommandations personnalisées

### Services API

- **Auth Service**: Login, Register, Logout
- **Exercise Service**: CRUD des exercices avec filtres par catégorie

### Composants Réutilisables

- `Header` - Navigation responsive
- `Footer` - Pied de page
- `MobileNav` - Navigation mobile bottom tab
- `WorkoutCard` - Carte d'espace d'entraînement
- `SessionCard` - Carte de séance

## 🎨 Thème et Styles

Le design utilise un thème dark moderne avec:

- Fond: neutral-950 avec dégradés vers slate-950
- Accents: sky-500, blue-500, cyan-400
- Effets: backdrop-blur, shadows avec glow
- Responsive: mobile-first avec breakpoints sm/md/lg

### Variables CSS Personnalisées

Toutes les variables sont définies dans `frontend/src/index.css`:

- Couleurs neutres étendues (neutral-925, neutral-850)
- Dégradés prédéfinis
- Shadows avec glow effects
- Classes utilitaires (btn-primary, btn-secondary, card-hover)

## 🔐 Authentification

L'application utilise JWT pour l'authentification:

1. Login/Register génère un token JWT
2. Token stocké dans localStorage
3. Envoyé dans les headers Authorization pour les requêtes protégées
4. Zustand store pour gérer l'état global

## 📱 Responsive Design

L'application est entièrement responsive:

- Desktop: Navigation horizontale, layout en grille
- Tablet: Layout adaptatif
- Mobile: Bottom navigation, cartes empilées

## 🔧 Configuration PostgreSQL

Le backend utilise Sequelize avec PostgreSQL. Les modèles sont automatiquement synchronisés au démarrage.

### Modèles créés:

- **User**: id (UUID), username, email, password (hashedpassword)
- **Exercise**: id (UUID), name, description, category, subcategory, type, image

## 🚦 Commandes Disponibles

### Backend

```bash
npm run server  # Démarrer avec nodemon
npm start       # Démarrer en production
```

### Frontend

```bash
npm run dev     # Mode développement
npm run build   # Build production
npm run preview # Preview build
npm run lint    # Linter
```

## 📝 Notes Importantes

1. **PostgreSQL**: Assurez-vous que PostgreSQL est installé et en cours d'exécution
2. **Variables d'environnement**: Configurez correctement les fichiers `.env` pour le backend et frontend
3. **Routes TanStack**: Les routes sont auto-générées dans `routeTree.gen.ts`
4. **CORS**: Le backend accepte toutes les origines en développement

## 🎯 Prochaines Étapes

- Ajouter la création/édition d'exercices personnalisés
- Implémenter le système de séances avec timer
- Ajouter les statistiques détaillées
- Créer le profil utilisateur
- Implémenter le système de streak et rewards complet
- Ajouter les notifications push

## 📄 Licence

Projet privé - FlowFit © 2025
