import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";
import { Play, Clock, Target, ArrowLeft, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
    // Préparer les données de la séance avec les paramètres personnalisés
    const sessionData = {
      ...session,
      customRestTime,
      exercises: session?.exercises?.map((ex) => ({
        ...ex,
        duration: customDurations[ex.exercise.id] || ex.duration,
      })),
    };

    navigate({
      to: "/session-player/$sessionId",
      params: { sessionId },
      search: {
        restTime: customRestTime,
        durations: JSON.stringify(customDurations),
      },
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Musculation":
        return "sky";
      case "Yoga":
        return "cyan";
      case "Mobilité":
        return "blue";
      case "Mixte":
        return "purple";
      default:
        return "sky";
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
                  color === "sky" && "bg-sky-500/20 text-sky-300",
                  color === "cyan" && "bg-cyan-500/20 text-cyan-300",
                  color === "blue" && "bg-blue-500/20 text-blue-300",
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
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>

                {ex.exercise.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
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
                      <label className="block text-xs text-neutral-400 mb-1">
                        Durée
                      </label>
                      <input
                        type="number"
                        min="5"
                        step="5"
                        value={customDurations[ex.exercise.id] || ex.duration}
                        onChange={(e) =>
                          updateExerciseDuration(
                            ex.exercise.id,
                            parseInt(e.target.value) || ex.duration
                          )
                        }
                        className="w-24 px-3 py-1.5 text-sm rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                      />
                      <span className="text-xs text-neutral-400 ml-2">
                        secondes
                      </span>
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
    </section>
  );
}
