import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";
import {
  Play,
  Clock,
  Target,
  ArrowLeft,
  Settings,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/session-details/$sessionId")({
  component: SessionDetailsPage,
});

function SessionDetailsPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [customDurations, setCustomDurations] = useState<{
    [key: string]: number;
  }>({});
  const [customRestTime, setCustomRestTime] = useState<number>(10);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    loadSession();
  }, [isAuthenticated, sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getById(sessionId);
      setSession(data);
      setCustomRestTime(data.restTime);

      // Initialiser les durées personnalisées avec les durées par défaut
      const durations: { [key: string]: number } = {};
      data.exercises?.forEach((ex) => {
        durations[ex.exercise.id] = ex.duration;
      });
      setCustomDurations(durations);

      // Charger la note de l'utilisateur
      const userRating = await sessionService.getUserRating(sessionId);
      if (userRating) {
        setSelectedRating(userRating);
      }
    } catch (err) {
      console.error("Erreur chargement séance:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseDuration = (exerciseId: string, duration: number) => {
    setCustomDurations((prev) => ({
      ...prev,
      [exerciseId]: duration,
    }));
  };

  const calculateTotalDuration = () => {
    if (!session?.exercises) return 0;
    const exercisesDuration = session.exercises.reduce((total, ex) => {
      return total + (customDurations[ex.exercise.id] || ex.duration);
    }, 0);
    const restDuration = (session.exercises.length - 1) * customRestTime;
    return exercisesDuration + restDuration + 5; // +5 pour le compte à rebours initial
  };

  const handleStartSession = () => {
    navigate({
      to: "/session-player/$sessionId",
      params: { sessionId },
      search: {
        restTime: customRestTime,
        durations: JSON.stringify(customDurations),
      },
    });
  };

  const handleRateSession = async (rating: number) => {
    if (!session) return;

    try {
      setRatingSubmitting(true);
      await sessionService.rate(session.id, rating);

      // Recharger la séance pour obtenir la nouvelle note
      await loadSession();
      setShowRatingModal(false);
    } catch (err) {
      console.error("Erreur lors de la notation:", err);
      alert("Une erreur est survenue lors de la notation");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}min ${secs}s` : `${secs}s`;
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
        <div className="text-center py-12 text-neutral-400">Chargement...</div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
        <div className="text-center py-12 text-neutral-400">
          Séance non trouvée
        </div>
      </section>
    );
  }

  const color = getCategoryColor(session.category);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate({ to: "/sessions" })}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux séances
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50 mb-2">
              {session.name}
            </h1>
            <p className="text-base text-neutral-300 mb-4">
              {session.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={cn(
                  "text-xs px-3 py-1 rounded-full",
                  color === "red" && "bg-red-500/20 text-red-300",
                  color === "blue" && "bg-blue-500/20 text-blue-300",
                  color === "green" && "bg-green-500/20 text-green-300",
                  color === "purple" && "bg-purple-500/20 text-purple-300"
                )}
              >
                {session.category}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-300">
                {session.difficulty}
              </span>
              <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                <Target className="w-4 h-4" />
                <span>{session.exercises?.length || 0} exercices</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(calculateTotalDuration())}</span>
              </div>
            </div>

            {/* Affichage de la note et bouton pour noter */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating
                  rating={session.rating || 0}
                  ratingCount={session.ratingCount || 0}
                  size="md"
                />
              </div>
              <button
                onClick={() => setShowRatingModal(true)}
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
              >
                <Star className="w-4 h-4" />
                {selectedRating > 0 ? "Modifier ma note" : "Noter cette séance"}
              </button>
              {selectedRating > 0 && (
                <span className="text-xs text-neutral-500">
                  (Vous avez donné {selectedRating} étoile
                  {selectedRating > 1 ? "s" : ""})
                </span>
              )}
              {session.createdBy && (
                <div className="flex items-center gap-1 text-sm text-neutral-400">
                  <User className="w-4 h-4" />
                  <span>Par {session.createdBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-neutral-50">
            Configuration de la séance
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Temps de repos entre exercices
            </label>
            <select
              value={customRestTime}
              onChange={(e) => setCustomRestTime(parseInt(e.target.value))}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
            >
              <option value={5}>5 secondes</option>
              <option value={10}>10 secondes</option>
              <option value={15}>15 secondes</option>
              <option value={20}>20 secondes</option>
              <option value={30}>30 secondes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des exercices */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-neutral-50 mb-4">
          Exercices de la séance
        </h2>

        <div className="space-y-3">
          {session.exercises?.map((ex, index) => (
            <div
              key={ex.exercise.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-300 text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>

                {ex.exercise.image && (
                  <div className="w-30 h-30 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                    <img
                      src={`http://localhost:4000${ex.exercise.image}`}
                      alt={ex.exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-neutral-50 mb-1">
                    {ex.exercise.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                    {ex.exercise.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-2">
                        Durée
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentDuration =
                              customDurations[ex.exercise.id] || ex.duration;
                            if (currentDuration > 5) {
                              updateExerciseDuration(
                                ex.exercise.id,
                                currentDuration - 5
                              );
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-50 transition-colors border border-neutral-700"
                          aria-label="Diminuer la durée"
                        >
                          -
                        </button>
                        <span className="min-w-[60px] text-center text-sm font-medium text-neutral-50">
                          {formatDuration(
                            customDurations[ex.exercise.id] || ex.duration
                          )}
                        </span>
                        <button
                          onClick={() => {
                            const currentDuration =
                              customDurations[ex.exercise.id] || ex.duration;
                            updateExerciseDuration(
                              ex.exercise.id,
                              currentDuration + 5
                            );
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-50 transition-colors border border-neutral-700"
                          aria-label="Augmenter la durée"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton de lancement */}
      <div className="flex justify-center">
        <button
          onClick={handleStartSession}
          className="btn-primary px-8 py-3 text-base"
        >
          <Play className="w-5 h-5 mr-2" />
          Lancer la séance
        </button>
      </div>

      {/* Modal de notation */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold text-neutral-50 mb-4">
              Noter cette séance
            </h2>

            <p className="text-sm text-neutral-400 mb-6">
              Votre avis aide les autres utilisateurs à découvrir les meilleures
              séances
            </p>

            <div className="flex justify-center mb-6">
              <StarRating
                rating={selectedRating}
                size="lg"
                interactive={true}
                showCount={false}
                onRate={(rating) => setSelectedRating(rating)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={async () => {
                  setShowRatingModal(false);
                  // Recharger la note de l'utilisateur au cas où il annule
                  const userRating =
                    await sessionService.getUserRating(sessionId);
                  if (userRating) {
                    setSelectedRating(userRating);
                  }
                }}
                className="flex-1 btn-secondary py-2.5"
                disabled={ratingSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleRateSession(selectedRating)}
                disabled={selectedRating === 0 || ratingSubmitting}
                className="flex-1 btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ratingSubmitting ? "..." : "Valider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
