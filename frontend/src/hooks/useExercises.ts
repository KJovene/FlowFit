import { useState, useEffect } from "react";
import { exerciseService } from "@/services/exercises";
import type { Exercise, FilterCategoryType } from "@/types";

export const useExercises = (filterCategory: FilterCategoryType = "all") => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exerciseService.getCommunityExercises(
        filterCategory !== "all" ? filterCategory : undefined
      );
      setExercises(data);
    } catch (err) {
      console.error("Erreur chargement exercices:", err);
      setError("Impossible de charger les exercices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, [filterCategory]);

  return {
    exercises,
    loading,
    error,
    loadExercises,
  };
};
