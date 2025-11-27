# 🗺️ Routes FlowFit - Documentation Complète

## Pages Publiques (Non Authentifiées)

### 🏠 Page d'Accueil

**Route**: `/`  
**Fichier**: `src/routes/index.tsx`  
**Description**: Landing page avec hero section, présentation des 3 espaces, mockup mobile  
**Composants**: WorkoutCard, SessionCard  
**Features**:

- Hero avec gradient "en 3 espaces clés"
- Badge "Sport à la maison"
- CTA "Créer une séance"
- Stats "+1 200 séances cette semaine"
- Aperçu des 3 espaces (Musculation, Yoga, Mobilité)
- Carte "Séance du jour"
- Mockup mobile interactif

### 🔐 Connexion

**Route**: `/login`  
**Fichier**: `src/routes/login.tsx`  
**Description**: Page de connexion avec formulaire  
**Service**: authService.login()  
**Features**:

- Formulaire email + password
- Gestion d'erreurs
- Redirection vers `/` après connexion
- Lien vers `/register`

### ✍️ Inscription

**Route**: `/register`  
**Fichier**: `src/routes/register.tsx`  
**Description**: Page d'inscription avec formulaire  
**Service**: authService.register()  
**Features**:

- Formulaire username + email + password + confirm
- Validation côté client
- Gestion d'erreurs
- Redirection vers `/` après inscription
- Lien vers `/login`

## Pages Programmes & Espaces

### 📚 Tous les Programmes

**Route**: `/programmes`  
**Fichier**: `src/routes/programmes.tsx`  
**Description**: Vue d'ensemble des 3 espaces d'entraînement  
**Features**:

- 3 WorkoutCards (Musculation, Yoga, Mobilité)
- Section "Recommandations du jour"
- Liens rapides vers chaque espace

### 💪 Espace Musculation

**Route**: `/musculation`  
**Fichier**: `src/routes/musculation.tsx`  
**Description**: Liste des séances de musculation  
**Features**:

- 6+ séances de force
- Filtres: Tous, Sans matériel, Haltères, Élastiques
- Hover effect avec bouton "Démarrer"
- Icône Dumbbell + couleur sky

### 🧘 Espace Yoga

**Route**: `/yoga`  
**Fichier**: `src/routes/yoga.tsx`  
**Description**: Liste des flows de yoga  
**Features**:

- 6+ flows (doux, dynamiques, méditation)
- Filtres: Tous, Flows doux, Dynamique, Méditation
- Hover effect avec bouton "Démarrer"
- Icône Flower2 + couleur cyan

### 🤸 Espace Mobilité

**Route**: `/mobilite`  
**Fichier**: `src/routes/mobilite.tsx`  
**Description**: Liste des routines de mobilité  
**Features**:

- 6+ routines courtes
- Filtres: Tous, Dos, Hanches, Épaules
- Hover effect avec bouton "Démarrer"
- Icône StretchHorizontal + couleur blue

## Pages Tracking & Profil

### 📅 Calendrier & Rewards

**Route**: `/calendar`  
**Fichier**: `src/routes/calendar.tsx`  
**Description**: Suivi hebdomadaire et système de badges  
**Features**:

- Vue semaine avec 7 jours
- États: Complété (vert), Prévu (bleu), Libre/Repos (gris)
- Navigation semaine (chevrons)
- Liste séances effectuées
- Objectif hebdo (3/5)
- Barre de progression
- Section badges:
  - Débloqués: "3 jours d'affilée" (Flame icon)
  - Verrouillés: "Semaine complète", "Champion du mois" (Lock icon)

### 👤 Profil Utilisateur

**Route**: `/profile`  
**Fichier**: `src/routes/profile.tsx`  
**Description**: Page profil avec stats et historique  
**Store**: useAuthStore  
**Features**:

- Avatar avec username et email
- Bouton déconnexion
- Stats: Séances semaine, Minutes total, Badges
- Répartition par catégorie (Musculation 45%, Yoga 30%, Mobilité 25%)
- Activité récente (3 dernières séances)
- Redirection vers `/login` si non authentifié

## 🎨 Layout & Navigation

### Layout Principal

**Fichier**: `src/routes/__root.tsx`  
**Composants**: Header, Footer, MobileNav  
**Features**:

- Gradient background (neutral-950 → slate-950)
- Glow effect top (sky-500/cyan-400)
- Header sticky
- Footer
- Mobile nav (bottom tab, visible < md)

### Header

**Composant**: `src/components/Header.tsx`  
**Navigation Desktop**:

- Logo FlowFit (FF)
- Liens: Accueil (avec barre active), Programmes, Calendrier
- Actions: FR, Connexion, S'inscrire

**Navigation Mobile**:

- Menu hamburger
- Drawer avec liens

### Mobile Navigation

**Composant**: `src/components/MobileNav.tsx`  
**Bottom Tab** (visible < md):

- Accueil (Home icon)
- Programmes (ListChecks icon)
- Profil (User icon)
- Active state avec couleur sky-300

## 📡 Services API

### Auth Service

**Fichier**: `src/services/auth.ts`  
**Méthodes**:

- `login(email, password)` → POST `/api/auth/login`
- `register(username, email, password)` → POST `/api/auth/register`
- `logout()` → clear localStorage
- `getToken()` → récupère JWT
- `getUser()` → récupère user
- `isAuthenticated()` → boolean

### Exercise Service

**Fichier**: `src/services/exercises.ts`  
**Méthodes**:

- `getAll(category?)` → GET `/api/exercises?category=X`
- `getById(id)` → GET `/api/exercises/:id`
- `create(formData)` → POST `/api/exercises` (protected)
- `update(id, formData)` → PUT `/api/exercises/:id` (protected)
- `delete(id)` → DELETE `/api/exercises/:id` (protected)

## 🗄️ State Management

### Auth Store (Zustand)

**Fichier**: `src/stores/authStore.ts`  
**État**:

```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

**Actions**:

- `login(email, password)`
- `register(username, email, password)`
- `logout()`
- `initAuth()` - Restaure depuis localStorage

## 🎯 Résumé Routes

| Route          | Fichier         | Auth Required | Description          |
| -------------- | --------------- | ------------- | -------------------- |
| `/`            | index.tsx       | ❌            | Page d'accueil       |
| `/login`       | login.tsx       | ❌            | Connexion            |
| `/register`    | register.tsx    | ❌            | Inscription          |
| `/programmes`  | programmes.tsx  | ❌            | Tous les programmes  |
| `/musculation` | musculation.tsx | ❌            | Séances musculation  |
| `/yoga`        | yoga.tsx        | ❌            | Flows yoga           |
| `/mobilite`    | mobilite.tsx    | ❌            | Routines mobilité    |
| `/calendar`    | calendar.tsx    | ❌\*          | Calendrier & rewards |
| `/profile`     | profile.tsx     | ✅            | Profil utilisateur   |

\*Accessible sans auth mais données limitées

## 🚀 Navigation Flow Typique

### Nouvel Utilisateur

```
/ (Accueil)
  → /register (Inscription)
    → / (Retour accueil, authentifié)
      → /programmes (Explorer)
        → /musculation (Choisir séance)
          → [Démarrer séance]
      → /calendar (Voir progression)
      → /profile (Stats personnelles)
```

### Utilisateur Existant

```
/ (Accueil)
  → /login (Connexion)
    → / (Dashboard)
      → /calendar (Check objectifs)
      → /yoga (Flow du jour)
      → /profile (Stats)
```

## 📱 Mobile Navigation Pattern

Sur mobile (< md):

- Header minimisé (logo + burger)
- MobileNav bottom tab active
- Swipe gestures entre pages
- Touch targets optimisés (min 44px)

## 🔗 Liens Externes Potentiels

Préparés pour:

- Partage social (Facebook, Twitter, Instagram)
- Export PDF des séances
- Calendrier iCal
- Notifications push
- Deep linking mobile app

## 🎨 Design Tokens par Route

### Page Accueil

- Gradient hero: from-sky-500/20 to-transparent
- Cards: neutral-900/60
- CTAs: gradient primary (sky→blue→cyan)

### Calendrier

- Jours complétés: bg-sky-500
- Jours prévus: border-sky-500/60 bg-sky-500/10
- Rewards card: border-sky-500/40 from-sky-500/20

### Espaces Entraînement

- Musculation: sky-500/20 (bleu ciel)
- Yoga: cyan-400/20 (cyan)
- Mobilité: blue-400/20 (bleu)

### Auth Pages

- Background: neutral-950/90
- Inputs: neutral-900/50
- Focus: ring-sky-500/50

---

**Total Routes**: 9 pages principales  
**Total Composants**: 5+ réutilisables  
**Total Services**: 2 (auth, exercises)  
**Total Stores**: 1 (authStore)

🎉 Application complète et documentée !
