import { useState, useEffect } from "react";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";

export const useHomeSessions = () => {
  const [latestSessions, setLatestSessions] = useState<Session[]>([]);
  const [topRatedSessions, setTopRatedSessions] = useState<Session[]>([]);
  const [topMusculation, setTopMusculation] = useState<Session[]>([]);
  const [topYoga, setTopYoga] = useState<Session[]>([]);
  const [topMobilite, setTopMobilite] = useState<Session[]>([]);
  const [topMixte, setTopMixte] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const allSessions = await sessionService.getAll();

        // Les 8 dernières séances créées
        const latest = [...allSessions]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 8);
        setLatestSessions(latest);

        // Top 8 séances toutes catégories
        const topRated = [...allSessions]
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 8);
        setTopRatedSessions(topRated);

        // Top 4 par catégorie
        const sortByRating = (sessions: Session[]) =>
          sessions.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.ratingCount - a.ratingCount;
          });

        const musculation = sortByRating(
          allSessions.filter((s) => s.category === "Musculation")
        ).slice(0, 4);
        setTopMusculation(musculation);

        const yoga = sortByRating(
          allSessions.filter((s) => s.category === "Yoga")
        ).slice(0, 4);
        setTopYoga(yoga);

        const mobilite = sortByRating(
          allSessions.filter((s) => s.category === "Mobilité")
        ).slice(0, 4);
        setTopMobilite(mobilite);

        const mixte = sortByRating(
          allSessions.filter((s) => s.category === "Mixte")
        ).slice(0, 4);
        setTopMixte(mixte);
      } catch (error) {
        console.error("Erreur lors du chargement des séances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return {
    latestSessions,
    topRatedSessions,
    topMusculation,
    topYoga,
    topMobilite,
    topMixte,
    loading,
  };
};
