# 📚 FlowFit - Guide des Bonnes Pratiques

## 🎨 Styling & Design

### Conventions Tailwind

```tsx
// ✅ BON - Classes dans l'ordre logique
<div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-neutral-50 hover:border-neutral-700 transition-colors">

// ❌ ÉVITER - Classes désordonnées
<div className="text-neutral-50 flex px-4 gap-2 border-neutral-800 items-center rounded-xl py-2 bg-neutral-900">
```

### Ordre des Classes Recommandé

1. Display (flex, grid, block)
2. Position (relative, absolute)
3. Size (w-, h-)
4. Spacing (p-, m-, gap-)
5. Typography (text-, font-)
6. Colors (bg-, text-, border-)
7. Effects (shadow-, opacity-)
8. Transitions (transition-, duration-)
9. States (hover:, focus:, active:)

### Utiliser cn() pour Conditions

```tsx
import { cn } from "@/lib/utils";

// ✅ BON
<button className={cn(
  "btn-primary",
  isActive && "ring-2 ring-sky-400",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// ❌ ÉVITER
<button className={`btn-primary ${isActive ? 'ring-2 ring-sky-400' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
```

## 🧩 Composants

### Structure d'un Composant

```tsx
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// 1. Types/Interfaces
interface MyComponentProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

// 2. Constantes (si nécessaires)
const VARIANTS = {
  primary: "bg-sky-500",
  secondary: "bg-neutral-800",
};

// 3. Composant
export function MyComponent({
  title,
  icon: Icon,
  onClick,
  className,
}: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {
    onClick?.();
  };

  // 6. Render
  return (
    <div className={cn("base-classes", className)}>
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
  );
}
```

### Naming Conventions

```tsx
// Components: PascalCase
export function WorkoutCard() {}

// Files: PascalCase.tsx
// WorkoutCard.tsx

// Props interfaces: ComponentNameProps
interface WorkoutCardProps {}

// Hooks: camelCase avec "use"
const useWorkout = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_SESSIONS = 5;

// Functions: camelCase
const calculateDuration = () => {};
```

## 📡 API & Services

### Structure d'un Service

```typescript
// services/myService.ts
const API_URL = import.meta.env.VITE_API_URL;

export interface MyType {
  id: string;
  name: string;
}

export const myService = {
  async getAll(): Promise<MyType[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    return data.data || [];
  },

  async getById(id: string): Promise<MyType> {
    // ...
  },
};
```

### Gestion d'Erreurs

```tsx
// ✅ BON - Try/catch avec message utilisateur
try {
  const result = await authService.login(credentials);
  if (!result.success) {
    setError(result.message || "Erreur de connexion");
  }
} catch (err) {
  setError("Une erreur est survenue. Veuillez réessayer.");
  console.error("Login error:", err);
}

// ❌ ÉVITER - Pas de gestion
const result = await authService.login(credentials);
```

## 🗄️ State Management

### Zustand Store Structure

```typescript
import { create } from "zustand";

interface MyStore {
  // État
  items: Item[];
  loading: boolean;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Item) => void;
  reset: () => void;
}

export const useMyStore = create<MyStore>((set, get) => ({
  // État initial
  items: [],
  loading: false,

  // Actions
  fetchItems: async () => {
    set({ loading: true });
    try {
      const items = await myService.getAll();
      set({ items, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },

  reset: () => {
    set({ items: [], loading: false });
  },
}));
```

### Utilisation dans Composants

```tsx
// ✅ BON - Sélection précise
const items = useMyStore((state) => state.items);
const fetchItems = useMyStore((state) => state.fetchItems);

// ❌ ÉVITER - Tout le store (re-renders inutiles)
const { items, loading, fetchItems } = useMyStore();
```

## 🚦 Routes & Navigation

### TanStack Router Pattern

```tsx
// routes/mypage.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage")({
  component: MyPage,
});

function MyPage() {
  // Composant
}
```

### Navigation Programmatique

```tsx
import { useNavigate } from "@tanstack/react-router";

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/other-page" });
  };
}
```

## 🎯 Performance

### Lazy Loading d'Images

```tsx
<img src={imageUrl} alt={alt} loading="lazy" className="w-full h-auto" />
```

### Mémoization

```tsx
import { useMemo, useCallback } from "react";

// Pour calculs coûteux
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Pour callbacks passés aux enfants
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

## 🔐 Sécurité

### Validation Côté Client

```tsx
// Toujours valider avant envoi
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!email.includes("@")) {
    setError("Email invalide");
    return;
  }

  if (password.length < 6) {
    setError("Mot de passe trop court");
    return;
  }

  // Envoi
  submitForm();
};
```

### Protection Routes

```tsx
// Vérifier auth avant affichage
function ProtectedPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  return <div>Protected content</div>;
}
```

## 📱 Responsive Design

### Breakpoints Tailwind

```tsx
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px

<div className="
  grid
  grid-cols-1          // Mobile
  sm:grid-cols-2       // Tablet
  lg:grid-cols-3       // Desktop
  gap-4
">
```

### Mobile-First

```tsx
// ✅ BON - Mobile first
<div className="text-sm sm:text-base lg:text-lg">

// ❌ ÉVITER - Desktop first
<div className="text-lg lg:text-base sm:text-sm">
```

## 🧪 Testing (Futur)

### Structure de Test

```tsx
// MyComponent.test.tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 📝 Documentation

### JSDoc pour Fonctions Complexes

```typescript
/**
 * Calculate workout duration based on exercises
 * @param exercises - Array of exercises with duration
 * @param restTime - Rest time between exercises in seconds
 * @returns Total duration in minutes
 */
function calculateWorkoutDuration(
  exercises: Exercise[],
  restTime: number
): number {
  // ...
}
```

### README pour Composants

```
components/
  WorkoutCard/
    WorkoutCard.tsx
    WorkoutCard.test.tsx
    README.md  # Documentation usage
```

## 🔄 Git Workflow

### Commits Conventionnels

```bash
# Format: type(scope): message

feat(auth): add login with JWT
fix(calendar): correct week calculation
style(ui): update button colors
docs(readme): add installation steps
refactor(api): simplify exercise service
test(auth): add login tests
chore(deps): update dependencies
```

### Branches

```bash
main          # Production stable
develop       # Développement
feature/xxx   # Nouvelles fonctionnalités
fix/xxx       # Corrections bugs
refactor/xxx  # Refactorisation
```

## 🚀 Déploiement

### Checklist Pré-Déploiement

- [ ] Variables d'environnement configurées
- [ ] Build frontend réussi (`npm run build`)
- [ ] Tests passés
- [ ] Pas d'erreurs lint
- [ ] Images optimisées
- [ ] JWT_SECRET changé
- [ ] CORS configuré correctement
- [ ] Base de données migrée
- [ ] SSL/HTTPS activé

### Variables d'Environnement Production

```env
# Backend
NODE_ENV=production
DB_NAME=FlowFit_prod
DB_HOST=production-host
JWT_SECRET=super-secure-random-string-change-this
PORT=4000

# Frontend
VITE_API_URL=https://api.flowfit.com
```

## 🎓 Ressources

### Documentation Officielle

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TanStack Router](https://tanstack.com/router)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Sequelize](https://sequelize.org)
- [Lucide Icons](https://lucide.dev)

### Outils Utiles

- [Tailwind Play](https://play.tailwindcss.com) - Tester Tailwind
- [Gradient Generator](https://www.css-gradient.com) - Créer gradients
- [Color Palette](https://coolors.co) - Palettes de couleurs
- [Icon Search](https://lucide.dev/icons) - Chercher icônes

## 💡 Tips & Astuces

### DevTools

```javascript
// Dans console browser
localStorage.getItem("token"); // Voir JWT
localStorage.clear(); // Reset auth

// Dans composant
console.log({ state }); // Debug state
```

### VS Code Extensions Recommandées

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Error Lens
- Prettier
- ESLint

### Shortcuts Utiles

- `rafce` → React Arrow Function Component Export
- `imr` → Import React
- `imp` → Import

## 🎯 Checklist Code Review

Avant de commit :

- [ ] Code formaté (Prettier)
- [ ] Pas d'erreurs TypeScript
- [ ] Pas de console.log inutiles
- [ ] Classes Tailwind ordonnées
- [ ] Composants réutilisables extraits
- [ ] Props typées correctement
- [ ] Gestion d'erreurs présente
- [ ] Responsive testé
- [ ] Accessibilité vérifiée (alt, aria-label)

---

**Keep it simple, keep it clean, keep it fast!** 🚀
