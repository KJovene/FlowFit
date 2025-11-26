import { Dumbbell, Flower2, StretchHorizontal } from "lucide-react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Musculation":
      return Dumbbell;
    case "Yoga":
      return Flower2;
    case "Mobilité":
      return StretchHorizontal;
    default:
      return Dumbbell;
  }
};

export const getCategoryColor = (
  category: string
): "red" | "blue" | "green" | "purple" => {
  switch (category) {
    case "Musculation":
      return "red";
    case "Yoga":
      return "blue";
    case "Mobilité":
      return "green";
    case "Mixte":
      return "purple";
    default:
      return "red";
  }
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Facile":
      return "text-green-400";
    case "Moyen":
      return "text-yellow-400";
    case "Difficile":
      return "text-red-400";
    default:
      return "text-neutral-400";
  }
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes > 0) {
    return secs > 0 ? `${minutes}min ${secs}s` : `${minutes} min`;
  }
  return `${secs} sec`;
};
