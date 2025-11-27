import { useState, useEffect } from "react";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";
import type { SortOrderType } from "@/types";

/**
 * Hook de gestion des séances favorites avec filtres
 * Gère le chargement, tri par note, filtrage par catégorie et suppression
 */
export const useFavoriteSessionsFilters = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("desc");
  const [removingFavorite, setRemovingFavorite] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [sortOrder]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getFavoriteSessions();

      // Appliquer le tri par notation
      const sortedData = [...data].sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortOrder === "desc" ? ratingB - ratingA : ratingA - ratingB;
      });

      setSessions(sortedData);
    } catch (err) {
      console.error("Erreur chargement séances favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (id: string) => {
    try {
      setRemovingFavorite(id);
      await sessionService.removeFromFavorites(id);
      await loadSessions();
    } catch (err) {
      console.error("Erreur suppression favori:", err);
      alert("Une erreur est survenue lors de la suppression");
    } finally {
      setRemovingFavorite(null);
    }
  };

  // Filtrage par catégorie
  const filteredByCategory = sessions.filter(
    (session) => filterCategory === "all" || session.category === filterCategory
  );

  return {
    sessions: filteredByCategory,
    loading,
    filterCategory,
    setFilterCategory,
    sortOrder,
    setSortOrder,
    removingFavorite,
    handleRemoveFromFavorites,
    totalCount: sessions.length,
  };
};
