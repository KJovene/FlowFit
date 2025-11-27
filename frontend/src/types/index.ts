// Types centralisés pour l'application

export interface User {
  id: string;
  username: string;
  email?: string;
  profileImage?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  image?: string;
  isShared?: boolean;
  creator?: User;
  createdAt: string;
}

export interface SessionExercise {
  exercise: Exercise;
  duration: number;
  order: number;
}

export interface Session {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  restTime: number;
  isShared: boolean;
  rating: number;
  ratingCount: number;
  exercises?: SessionExercise[];
  creator?: User;
  createdBy?: string;
  createdAt: string;
}

export type CategoryType = "Musculation" | "Yoga" | "Mobilité" | "Mixte";
export type DifficultyType = "Facile" | "Moyen" | "Difficile";
export type FilterCategoryType = "all" | CategoryType;
export type FilterSharedType = "all" | "shared" | "private";
export type SortOrderType = "desc" | "asc";

export interface ExerciseFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
}

export interface SessionConfig {
  customDurations: Record<string, number>;
  customRestTime: number;
}
