# 🎨 FlowFit - Design System

## 🎯 Vue d'Ensemble

FlowFit utilise un design system moderne basé sur un thème **dark** avec des accents **sky/blue/cyan**.

---

## 🎨 Palette de Couleurs

### Couleurs Principales

```css
/* Fond */
--bg-primary: #0a0a0a (neutral-950)
--bg-secondary: #18181b (neutral-900)
--bg-tertiary: #27272a (neutral-800)

/* Gradients */
--gradient-primary: linear-gradient(to-r, #0ea5e9, #3b82f6, #22d3ee)
--gradient-hero: linear-gradient(to-b, #0a0a0a, #0a0a0a, #0f172a)

/* Accents */
--accent-sky: #0ea5e9 (sky-500)
--accent-blue: #3b82f6 (blue-500)
--accent-cyan: #22d3ee (cyan-400)

/* Texte */
--text-primary: #fafafa (neutral-50)
--text-secondary: #d4d4d8 (neutral-300)
--text-tertiary: #a1a1aa (neutral-400)
```

### Couleurs par Catégorie

| Catégorie       | Couleur Principale | Gradient                       | Usage                |
| --------------- | ------------------ | ------------------------------ | -------------------- |
| **Musculation** | sky-500 (#0ea5e9)  | from-sky-500/20 via-blue-500/5 | Cards, icons, badges |
| **Yoga**        | cyan-400 (#22d3ee) | from-cyan-400/20 via-sky-500/5 | Cards, icons, badges |
| **Mobilité**    | blue-400 (#60a5fa) | from-blue-400/20 via-sky-400/5 | Cards, icons, badges |

---

## 🧩 Composants de Base

### Boutons

#### Button Primary

```tsx
<button className="btn-primary px-5 py-2">Action Principale</button>
```

**Style**: Gradient sky→blue→cyan, shadow glow, hover scale(1.05)

#### Button Secondary

```tsx
<button className="btn-secondary px-4 py-2">Action Secondaire</button>
```

**Style**: Border neutral-700, bg neutral-900, hover lighter

### Cards

#### Workout Card

```
┌─────────────────────────────────┐
│ [Icon] Titre            Badge   │
│        Description              │
│                                 │
│ • Item 1                        │
│ • Item 2                        │
│ • Item 3                        │
│                                 │
│ Ouvrir l'espace →              │
└─────────────────────────────────┘
```

**Classes**: `workout-card`, gradient overlay, border neutral-800/90

#### Session Card

```
┌─────────────────────────┐
│ Musculation    30 min   │
│                         │
│ Full Body maison        │
│ Sans matériel           │
└─────────────────────────┘
```

**Style**: Gradient from-{color}/25, border-{color}/40

---

## 🎭 États & Interactions

### Hover Effects

```css
/* Cards */
.card-hover {
  transition: all 300ms;
  hover: {
    border-neutral-600/80
    shadow-lg shadow-black/40
    scale(1.02)
  }
}

/* Boutons */
.btn-primary:hover {
  scale(1.05)
  shadow: 0 15px 35px rgba(14, 165, 233, 0.5)
}
```

### States Calendrier

| État         | Couleur                         | Description      |
| ------------ | ------------------------------- | ---------------- |
| **Complété** | bg-sky-500                      | Séance effectuée |
| **Prévu**    | border-sky-500/60 bg-sky-500/10 | Séance planifiée |
| **Repos**    | bg-neutral-900                  | Jour de repos    |
| **Libre**    | bg-neutral-900                  | Pas de plan      |

---

## 📐 Spacing & Layout

### Padding/Margin System

```css
xs: 0.5rem (2px)
sm: 1rem (4px)
md: 1.5rem (6px)
lg: 2rem (8px)
xl: 3rem (12px)
```

### Container Widths

```css
max-w-6xl: 72rem (1152px) - Layout principal
max-w-4xl: 56rem (896px) - Profil
max-w-md: 28rem (448px) - Auth forms
```

### Grid Patterns

```tsx
// Mobile → Tablet → Desktop
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

// 2 colonnes asymétriques
lg:grid-cols-[1.3fr,0.7fr]

// Gap consistant
gap-4 lg:gap-6
```

---

## 🔤 Typography

### Hiérarchie

```css
/* Hero Title */
text-3xl sm:text-4xl lg:text-5xl
font-semibold tracking-tight

/* Section Title */
text-xl sm:text-2xl
font-semibold tracking-tight

/* Card Title */
text-sm font-medium tracking-tight

/* Body */
text-base text-neutral-300

/* Caption */
text-xs text-neutral-400
```

### Font Weights

- Semibold (600): Titres, boutons
- Medium (500): Sous-titres, labels
- Regular (400): Texte body

---

## 🎆 Effets Visuels

### Glow Effects

```css
/* Primary Glow */
box-shadow: 0 0 40px rgba(14, 165, 233, 0.4);

/* Button Glow */
box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);

/* Hover Intensified */
box-shadow: 0 15px 35px rgba(14, 165, 233, 0.5);
```

### Backdrop Blur

```css
/* Glass Effect */
backdrop-blur-md bg-neutral-950/60

/* Header/Footer */
backdrop-blur-md bg-neutral-950/95
```

### Gradients

```css
/* Hero Top */
bg-gradient-to-b from-sky-500/20 via-cyan-400/10 to-transparent

/* Button */
bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400

/* Background */
bg-gradient-to-b from-neutral-950 via-neutral-950 to-slate-950
```

---

## 📱 Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px   // Tablet portrait
md: 768px   // Tablet landscape
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Mobile-First Examples

```tsx
// Texte
text-sm sm:text-base lg:text-lg

// Padding
px-4 sm:px-6 lg:px-8

// Grid
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
```

---

## 🎯 Icons (Lucide React)

### Tailles Standardisées

```tsx
// Small (buttons, badges)
<Icon className="w-3.5 h-3.5 stroke-[1.5]" />

// Medium (cards, nav)
<Icon className="w-4 h-4 stroke-[1.5]" />

// Large (headers, hero)
<Icon className="w-6 h-6 stroke-[1.5]" />
```

### Icons par Section

| Section     | Icon | Nom Lucide          |
| ----------- | ---- | ------------------- |
| Musculation | 💪   | `Dumbbell`          |
| Yoga        | 🧘   | `Flower2`           |
| Mobilité    | 🤸   | `StretchHorizontal` |
| Calendrier  | 📅   | `Calendar`          |
| Rewards     | 🏆   | `Award`             |
| Stats       | 📊   | `Activity`          |
| Profil      | 👤   | `User`              |

---

## 🎬 Animations

### Transitions Standard

```css
transition-all duration-300

/* Hover Scale */
hover:scale-105 transition-all

/* Fade In */
opacity-0 animate-fade-in
```

### Loading States

```css
.pulse-glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
  }
  50% {
    opacity: 0.5;
    box-shadow: 0 0 40px rgba(14, 165, 233, 0.6);
  }
}
```

---

## 🎨 Exemples de Layouts

### Hero Section

```
┌───────────────────────────────────────────┐
│  [Badge]                                  │
│  Titre Principal en gradient              │
│  Description secondaire                   │
│                                           │
│  [CTA Button]  Stats +1200 séances       │
│                                           │
│  ┌───────┐ ┌───────┐ ┌───────┐          │
│  │ Muscu │ │ Yoga  │ │ Mobil │          │
│  └───────┘ └───────┘ └───────┘          │
└───────────────────────────────────────────┘
```

### Calendrier Week View

```
┌────────────────────────────────────┐
│  [←] [→] Semaine du 12 au 18      │
│                                    │
│  Lun  Mar  Mer  Jeu  Ven  Sam  Dim│
│  [✓]  [○]  [✓]  [ ]  [✓]  [ ]  [ ]│
│  OK   Prévu OK  Libre OK  Repos    │
└────────────────────────────────────┘
```

### Mobile Bottom Nav

```
┌────────────────────────┐
│  [Home] [List] [User]  │
└────────────────────────┘
```

---

## 📋 Checklist Design Token

Quand tu crées un nouveau composant :

- [ ] Utilise les couleurs de la palette définie
- [ ] Respecte le spacing system (gap-4, p-4, etc.)
- [ ] Ajoute backdrop-blur pour effets glass
- [ ] Inclut hover/focus states
- [ ] Teste responsive (mobile → desktop)
- [ ] Vérifie contraste texte (AA standard)
- [ ] Utilise tracking-tight pour titres
- [ ] Stroke-[1.5] pour icons
- [ ] Transition-all duration-300 pour animations

---

## 🎨 Color Picker Reference

**Copie-colle ces valeurs pour design tools** :

```
Sky-500: #0EA5E9
Blue-500: #3B82F6
Cyan-400: #22D3EE

Neutral-950: #0A0A0A
Neutral-900: #171717
Neutral-800: #262626
Neutral-700: #404040
Neutral-500: #737373
Neutral-400: #A3A3A3
Neutral-300: #D4D4D4
Neutral-50: #FAFAFA
```

---

## 🚀 Live Preview

- **App**: http://localhost:5173
- **Storybook** (futur): http://localhost:6006

---

**Design is not just what it looks like. Design is how it works.** ✨
