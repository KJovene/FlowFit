# Feature: Séparation Espace Personnel et Communautaire

## Vue d'ensemble

Ce système permet de séparer les séances personnelles des séances communautaires. Les utilisateurs peuvent créer des séances privées et choisir de les partager avec la communauté.

## Modifications Backend

### 1. Modèle Session (`backend/models/Session.js`)

- Ajout du champ `isShared` (BOOLEAN, default: false)
- Indique si une séance est partagée avec la communauté

### 2. Controller (`backend/controllers/sessionController.js`)

#### Nouvelles fonctions :

- **`shareSession`** : Permet au créateur de partager sa séance avec la communauté

  - Met à jour `isShared` à `true`
  - Vérifie que l'utilisateur est le créateur
  - Endpoint: `POST /api/sessions/:id/share`

- **`getUserSessions`** : Récupère les séances créées par l'utilisateur
  - Accepte un paramètre `?shared=true/false` pour filtrer
  - Endpoint: `GET /api/sessions/my-sessions`

#### Modifications :

- **`getAllSessions`** : Modifié pour ne retourner que les séances avec `isShared=true`
  - Affiche uniquement les séances communautaires

### 3. Routes (`backend/routes/sessions.js`)

- `POST /api/sessions/:id/share` - Partager une séance
- `GET /api/sessions/my-sessions` - Récupérer mes séances

### 4. Migration (`backend/migrations/add-isShared-to-sessions.js`)

- Script pour ajouter la colonne `isShared` à la table Sessions
- Compatible PostgreSQL
- Exécuter avec : `node migrations/add-isShared-to-sessions.js`

## Modifications Frontend

### 1. Service (`frontend/src/services/sessions.ts`)

#### Interface Session :

- Ajout du champ `isShared: boolean`

#### Nouvelles méthodes :

- **`share(id: string)`** : Partage une séance avec la communauté
- **`getUserSessions(shared?: boolean)`** : Récupère les séances de l'utilisateur
  - `shared=true` : Uniquement les séances partagées
  - `shared=false` : Uniquement les séances privées
  - `shared=undefined` : Toutes les séances

### 2. Page Session Details (`frontend/src/routes/session-details.$sessionId.tsx`)

#### Nouvelles fonctionnalités :

- Bouton "Partager" visible uniquement pour le créateur de la séance
- Badge "Privée" affiché sur les séances non partagées
- Confirmation avant le partage
- Mise à jour automatique après partage

### 3. Page Profile (`frontend/src/routes/profile.tsx`)

#### Section "Mes Séances" :

- Affiche toutes les séances créées par l'utilisateur
- **Filtres** :
  - Toutes (nombre total)
  - Partagées (avec icône Share2)
  - Privées (avec icône Lock)
- Badge "Privée" sur les cards des séances non partagées
- Compteurs dynamiques pour chaque filtre

### 4. Page Home (`frontend/src/routes/index.tsx`)

- Affiche uniquement les séances communautaires (isShared=true)
- Les séances privées n'apparaissent pas dans les découvertes

## Flux Utilisateur

### Créer une séance

1. L'utilisateur crée une séance via le SessionBuilder
2. La séance est créée avec `isShared=false` (privée par défaut)
3. Elle apparaît dans "Mes Séances" avec le badge "Privée"

### Partager une séance

1. L'utilisateur accède aux détails de sa séance
2. Il clique sur le bouton "Partager"
3. Il confirme l'action
4. `isShared` passe à `true`
5. La séance devient visible dans la communauté

### Découvrir des séances

1. Page d'accueil : affiche uniquement les séances partagées
2. Page "Les séances" : affiche uniquement les séances communautaires
3. Les séances privées restent accessibles uniquement via "Mes Séances"

## Sécurité

- Seul le créateur d'une séance peut la partager
- Vérification du `createdBy` avec l'ID de l'utilisateur connecté
- Les séances privées ne sont pas exposées via l'API publique
- Authentification requise pour toutes les opérations

## Style

### Badges et indicateurs

- **Badge "Privée"** : `bg-amber-500/20 text-amber-300` avec icône Lock
- **Filtre "Partagées"** : `bg-green-500/20 text-green-300` avec icône Share2
- **Filtre "Privées"** : `bg-amber-500/20 text-amber-300` avec icône Lock
- **Bouton "Partager"** : `btn-primary` avec icône Share2

## Tests recommandés

1. Créer une séance et vérifier qu'elle est privée par défaut
2. Partager la séance et vérifier qu'elle apparaît dans la communauté
3. Vérifier les filtres dans "Mes Séances"
4. Tester qu'un autre utilisateur ne peut pas partager votre séance
5. Vérifier que les séances privées n'apparaissent pas dans les découvertes

## Points d'amélioration futurs

- Permettre de "dé-partager" une séance
- Système de modération des séances communautaires
- Statistiques sur les vues/utilisations des séances partagées
- Catégories "Tendances" basées sur les partages récents
- Notifications lors du partage réussi
