import { useState, useEffect } from "react";
import { sessionService } from "@/services/sessions";
import type { Session, FilterCategoryType, SortOrderType } from "@/types";

export const useSessions = (
  filterCategory: FilterCategoryType = "all",
  sortOrder: SortOrderType = "desc"
) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sessionService.getAll(
        filterCategory !== "all" ? filterCategory : undefined
      );

      // Trier par notation
      const sortedData = [...data].sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortOrder === "desc" ? ratingB - ratingA : ratingA - ratingB;
      });

      setSessions(sortedData);
    } catch (err) {
      console.error("Erreur chargement séances:", err);
      setError("Impossible de charger les séances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [filterCategory, sortOrder]);

  const deleteSession = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) {
      return false;
    }

    try {
      await sessionService.delete(id);
      await loadSessions();
      return true;
    } catch (err) {
      console.error("Erreur suppression:", err);
      return false;
    }
  };

  return {
    sessions,
    loading,
    error,
    loadSessions,
    deleteSession,
  };
};
