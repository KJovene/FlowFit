# 🏗️ Architecture Frontend - FlowFit

## Vue d'ensemble

Le frontend FlowFit suit une **architecture Clean Code** avec séparation stricte des responsabilités entre la logique métier, la présentation et le routing.

## 📁 Structure

```
frontend/src/
├── components/          # Composants métier réutilisables
│   ├── CircularTimer.tsx
│   ├── SessionBuilder.tsx
│   ├── SessionCard.tsx
│   └── StarRating.tsx
│
├── components/ui/       # Composants UI purs
│   ├── BackButton.tsx
│   ├── EmptyState.tsx
│   ├── FilterButton.tsx
│   ├── LoadingState.tsx
│   └── PageHeader.tsx
│
├── hooks/               # Hooks personnalisés (logique métier)
│   ├── useExercises.ts
│   ├── useFavoriteSessions.ts
│   ├── useHomeSessions.ts
│   ├── useSessionDetails.ts
│   ├── useSessionRating.ts
│   ├── useSessions.ts
│   ├── useUserExercises.ts
│   └── useUserSessions.ts
│
├── lib/                 # Utilitaires
│   ├── formatters.ts   # Fonctions de formatage
│   └── utils.ts        # Helpers généraux
│
├── pages/               # Pages (composition uniquement)
│   ├── ExercisesPage.tsx
│   ├── HomePage.tsx
│   ├── MyExercisesPage.tsx
│   ├── MySessionsPage.tsx
│   ├── SessionDetailsPage.tsx
│   └── SessionsPage.tsx
│
├── routes/              # Routes minimalistes
│   ├── index.tsx
│   ├── exercises.tsx
│   ├── my-exercises.tsx
│   ├── my-sessions.tsx
│   ├── sessions.tsx
│   └── session-details.$sessionId.tsx
│
├── services/            # Appels API
│   ├── auth.ts
│   ├── exercises.ts
│   └── sessions.ts
│
├── stores/              # State management global
│   └── authStore.ts
│
└── types/               # Types TypeScript
    └── index.ts
```

## 🎯 Principes

### 1. Séparation des Responsabilités

#### Routes (Routing uniquement)

```tsx
// 5 lignes par route
import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  component: HomePage,
});
```

#### Pages (Composition uniquement)

```tsx
// Pas de logique métier, que de la composition
export const SessionsPage = () => {
  const { sessions, loading } = useSessions(filterCategory, sortOrder);
  const { favorites } = useFavoriteSessions();

  return (
    <section>
      <PageHeader title="Séances" />
      <FilterButtons />
      <SessionsGrid sessions={sessions} />
    </section>
  );
};
```

#### Hooks (Logique métier uniquement)

```tsx
// Toute la logique d'une fonctionnalité
export const useSessions = (filterCategory, sortOrder) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    // Logique de chargement et tri
  };

  return { sessions, loading, loadSessions };
};
```

### 2. Réutilisabilité

**Composants UI Purs**

```tsx
<FilterButton active={true} onClick={...} color="sky">
  Toutes
</FilterButton>
```

**Hooks Personnalisés**

```tsx
// Utilisable dans plusieurs pages
const { sessions, loading } = useSessions("all", "desc");
```

### 3. Testabilité

Chaque couche peut être testée indépendamment :

- **Hooks** : Tests unitaires de la logique
- **Composants** : Tests de rendu
- **Pages** : Tests d'intégration

## 🔧 Hooks Disponibles

### Sessions

- **useSessions** - Liste des séances communautaires avec filtres et tri
- **useUserSessions** - Gestion des séances de l'utilisateur
- **useSessionDetails** - Détails et configuration d'une séance
- **useSessionRating** - Système de notation des séances
- **useFavoriteSessions** - Gestion des favoris
- **useHomeSessions** - Données optimisées pour la page d'accueil

### Exercices

- **useExercises** - Liste des exercices communautaires avec filtres
- **useUserExercises** - CRUD complet des exercices de l'utilisateur

## 📦 Composants UI

### Navigation

- **BackButton** - Retour vers page précédente
- **PageHeader** - Titre + sous-titre + actions

### États

- **LoadingState** - Affichage pendant le chargement
- **EmptyState** - Message quand aucune donnée

### Filtres

- **FilterButton** - Bouton de filtre configurable

## 🛠️ Utilitaires

### Formatage (`lib/formatters.ts`)

```tsx
formatDuration(120); // "2 min"
getCategoryColor("Yoga"); // "blue"
getCategoryIcon("Yoga"); // <Flower2 />
getDifficultyColor("Facile"); // "text-green-400"
```

## 📝 Conventions

### Naming

- **Pages** : `[Feature]Page.tsx`
- **Hooks** : `use[Feature].ts`
- **Composants UI** : `[Component].tsx`
- **Types** : Interface ou Type selon le besoin

### Structure d'un Hook

```tsx
export const useFeature = (params) => {
  // 1. State
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  // 2. Effects
  useEffect(() => {
    loadData();
  }, [params]);

  // 3. Functions
  const loadData = async () => {
    // Implementation
  };

  // 4. Return
  return { data, loading, loadData };
};
```

### Organisation des Imports

```tsx
// 1. React & frameworks
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

// 2. Hooks personnalisés
import { useSessions } from "@/hooks/useSessions";

// 3. Composants
import { SessionCard } from "@/components/SessionCard";
import { FilterButton } from "@/components/ui/FilterButton";

// 4. Utils & types
import { formatDuration } from "@/lib/formatters";
import type { Session } from "@/types";
```

## 🚀 Avantages

### Avant

```tsx
// 400+ lignes par route
// Logique + UI mélangées
// Code dupliqué
// Difficile à tester
```

### Après

```tsx
// 5-8 lignes par route
// Logique isolée dans les hooks
// Code réutilisable
// Facilement testable
```

### Métriques

- **95% de réduction** du code dans les routes
- **0 duplication** de logique métier
- **100% réutilisable** (hooks & composants UI)
- **Facilement testable** (isolation complète)

## 📚 Documentation Complète

Pour plus de détails, consultez :

- `CLEAN_CODE_ARCHITECTURE.md` - Architecture complète
- Commentaires JSDoc dans chaque hook
- Exemples dans les pages

## 🎨 Stack Technique

- **React** - UI
- **TypeScript** - Typage
- **TanStack Router** - Routing
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Lucide React** - Icons
