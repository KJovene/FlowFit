import { useState, useEffect } from "react";
import { exerciseService } from "@/services/exercises";
import type { Exercise, FilterSharedType, ExerciseFormData } from "@/types";

export const useUserExercises = (filterShared: FilterSharedType = "all") => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: Exercise[] = [];

      if (filterShared === "all") {
        data = await exerciseService.getMyExercises();
      } else if (filterShared === "shared") {
        data = await exerciseService.getMyExercises(true);
      } else {
        data = await exerciseService.getMyExercises(false);
      }

      setExercises(data);
    } catch (err) {
      console.error("Erreur chargement exercices:", err);
      setError("Impossible de charger vos exercices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, [filterShared]);

  const createExercise = async (
    formData: ExerciseFormData,
    imageFile: File
  ) => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("image", imageFile);

      await exerciseService.create(data);
      await loadExercises();
      return { success: true, error: null };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Une erreur est survenue",
      };
    }
  };

  const updateExercise = async (
    id: string,
    formData: ExerciseFormData,
    imageFile?: File
  ) => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      if (imageFile) {
        data.append("image", imageFile);
      }

      await exerciseService.update(id, data);
      await loadExercises();
      return { success: true, error: null };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Une erreur est survenue",
      };
    }
  };

  const deleteExercise = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
      return false;
    }

    try {
      await exerciseService.delete(id);
      await loadExercises();
      return true;
    } catch (err) {
      console.error("Erreur suppression:", err);
      return false;
    }
  };

  const toggleShare = async (id: string) => {
    try {
      await exerciseService.toggleShare(id);
      await loadExercises();
      return { success: true, error: null };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Une erreur est survenue",
      };
    }
  };

  return {
    exercises,
    loading,
    error,
    loadExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    toggleShare,
    sharedCount: exercises.filter((e) => e.isShared).length,
    privateCount: exercises.filter((e) => !e.isShared).length,
  };
};
