import { useState, useEffect, useRef } from "react";
import { sessionService, type Session } from "@/services/sessions";
import { exerciseService, type Exercise } from "@/services/exercises";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

/**
 * Hook de gestion de la page profil
 * Charge et gère les données du profil utilisateur (séances, exercices, favoris, photo)
 */
export const useProfile = () => {
  const { updateProfileImage } = useAuthStore();
  const [mySessions, setMySessions] = useState<Session[]>([]);
  const [favoriteSessions, setFavoriteSessions] = useState<Session[]>([]);
  const [myExercises, setMyExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMySessions();
    loadFavoriteSessions();
    loadMyExercises();
  }, []);

  const loadMySessions = async () => {
    try {
      setLoading(true);
      const sessions = await sessionService.getUserSessions();
      setMySessions(sessions);
    } catch (error) {
      console.error("Erreur chargement séances:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteSessions = async () => {
    try {
      setLoadingFavorites(true);
      const sessions = await sessionService.getFavoriteSessions();
      setFavoriteSessions(sessions);
    } catch (error) {
      console.error("Erreur chargement favoris:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const loadMyExercises = async () => {
    try {
      const exercises = await exerciseService.getMyExercises();
      setMyExercises(exercises);
    } catch (error) {
      console.error("Erreur chargement exercices:", error);
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 5 MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    try {
      setUploadingImage(true);
      const response = await authService.uploadProfileImage(file);

      if (response.success && response.user?.profileImage) {
        updateProfileImage(response.user.profileImage);
        alert("Photo de profil mise à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour de la photo");
      }
    } catch (error) {
      console.error("Erreur upload photo:", error);
      alert("Erreur lors de l'upload de la photo");
    } finally {
      setUploadingImage(false);
    }
  };

  // Calcul des statistiques
  const sharedSessionsCount = mySessions.filter((s) => s.isShared).length;
  const privateSessionsCount = mySessions.filter((s) => !s.isShared).length;
  const sharedExercisesCount = myExercises.filter((e) => e.isShared).length;
  const privateExercisesCount = myExercises.filter((e) => !e.isShared).length;

  return {
    mySessions,
    favoriteSessions,
    myExercises,
    loading,
    loadingFavorites,
    uploadingImage,
    fileInputRef,
    handleProfileImageClick,
    handleImageChange,
    stats: {
      sharedSessionsCount,
      privateSessionsCount,
      sharedExercisesCount,
      privateExercisesCount,
    },
  };
};
