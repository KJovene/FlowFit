import { useState, useEffect } from "react";
import { sessionService } from "@/services/sessions";

export const useFavoriteSessions = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [togglingFavorite, setTogglingFavorite] = useState<string | null>(null);

  const loadFavorites = async () => {
    try {
      const favoriteSessions = await sessionService.getFavoriteSessions();
      const favoriteIds = new Set(favoriteSessions.map((s) => s.id));
      setFavorites(favoriteIds);
    } catch (err) {
      console.error("Erreur chargement favoris:", err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const toggleFavorite = async (sessionId: string) => {
    try {
      setTogglingFavorite(sessionId);
      const isFavorite = favorites.has(sessionId);

      if (isFavorite) {
        await sessionService.removeFromFavorites(sessionId);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(sessionId);
          return newSet;
        });
      } else {
        await sessionService.addToFavorites(sessionId);
        setFavorites((prev) => new Set(prev).add(sessionId));
      }

      return { success: true };
    } catch (err) {
      console.error("Erreur toggle favori:", err);
      return { success: false };
    } finally {
      setTogglingFavorite(null);
    }
  };

  return {
    favorites,
    togglingFavorite,
    toggleFavorite,
    loadFavorites,
  };
};
