import { useState, useEffect } from "react";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";

export const useSessionDetails = (sessionId: string) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);

  const loadSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sessionService.getById(sessionId);
      setSession(data);

      // Charger la note de l'utilisateur
      const userRating = await sessionService.getUserRating(sessionId);
      if (userRating) {
        setSelectedRating(userRating);
      }
    } catch (err) {
      console.error("Erreur chargement séance:", err);
      setError("Impossible de charger la séance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const rateSession = async (rating: number) => {
    if (!session) return { success: false };

    try {
      await sessionService.rate(session.id, rating);
      await loadSession();
      return { success: true };
    } catch (err) {
      console.error("Erreur lors de la notation:", err);
      return { success: false };
    }
  };

  const toggleShare = async () => {
    if (!session) return { success: false, error: "Aucune séance" };

    try {
      await sessionService.toggleShare(session.id);
      await loadSession();
      return { success: true, error: null };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Une erreur est survenue",
      };
    }
  };

  return {
    session,
    loading,
    error,
    selectedRating,
    setSelectedRating,
    loadSession,
    rateSession,
    toggleShare,
  };
};
