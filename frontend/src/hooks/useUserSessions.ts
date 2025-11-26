import { useState, useEffect } from "react";
import { sessionService } from "@/services/sessions";
import type { Session, FilterSharedType, SortOrderType } from "@/types";

export const useUserSessions = (
  filterShared: FilterSharedType = "all",
  sortOrder: SortOrderType = "desc"
) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: Session[] = [];

      if (filterShared === "all") {
        data = await sessionService.getUserSessions();
      } else if (filterShared === "shared") {
        data = await sessionService.getUserSessions(true);
      } else {
        data = await sessionService.getUserSessions(false);
      }

      // Trier par notation
      const sortedData = [...data].sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortOrder === "desc" ? ratingB - ratingA : ratingA - ratingB;
      });

      setSessions(sortedData);
    } catch (err) {
      console.error("Erreur chargement séances:", err);
      setError("Impossible de charger vos séances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [filterShared, sortOrder]);

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
    sharedCount: sessions.filter((s) => s.isShared).length,
    privateCount: sessions.filter((s) => !s.isShared).length,
  };
};
