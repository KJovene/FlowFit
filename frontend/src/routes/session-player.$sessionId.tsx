import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";
import {
  Pause,
  Play,
  X,
  CheckCircle2,
  ChevronRight,
  Coffee,
} from "lucide-react";
import { CircularTimer } from "@/components/CircularTimer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/session-player/$sessionId")({
  component: SessionPlayerPage,
});

type Phase = "countdown" | "exercise" | "rest" | "completed";

function SessionPlayerPage() {
  const { sessionId } = Route.useParams();
  const searchParams = Route.useSearch() as {
    restTime?: number;
    durations?: string;
  };
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("countdown");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5); // Countdown initial 5s
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const customRestTime = searchParams.restTime || 10;
  const customDurations = searchParams.durations
    ? JSON.parse(searchParams.durations)
    : {};

  // Bloquer le scroll sur cette page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
    } catch (err) {
      console.error("Erreur chargement séance:", err);
      navigate({ to: "/sessions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !session || isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          handlePhaseComplete();
          return 0;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, currentExerciseIndex, isPaused, loading, session]);

  const handlePhaseComplete = () => {
    if (!session?.exercises) return;

    if (phase === "countdown") {
      // Fin du compte à rebours → premier exercice
      setPhase("exercise");
      const firstExerciseDuration =
        customDurations[session.exercises[0].exercise.id] ||
        session.exercises[0].duration;
      setTimeRemaining(firstExerciseDuration);
    } else if (phase === "exercise") {
      // Fin de l'exercice → repos ou exercice suivant ou fin
      if (currentExerciseIndex < session.exercises.length - 1) {
        setPhase("rest");
        setTimeRemaining(customRestTime);
      } else {
        // Dernier exercice terminé
        setPhase("completed");
      }
    } else if (phase === "rest") {
      // Fin du repos → exercice suivant
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setPhase("exercise");
      const nextExerciseDuration =
        customDurations[session.exercises[nextIndex].exercise.id] ||
        session.exercises[nextIndex].duration;
      setTimeRemaining(nextExerciseDuration);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleExit = () => {
    if (phase === "completed") {
      navigate({ to: "/sessions" });
    } else {
      setShowExitConfirm(true);
    }
  };

  const confirmExit = () => {
    navigate({ to: "/sessions" });
  };

  if (!isAuthenticated || loading) return null;

  if (!session || !session.exercises || session.exercises.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">
            Impossible de charger la séance
          </p>
          <button
            onClick={() => navigate({ to: "/sessions" })}
            className="btn-secondary"
          >
            Retour
          </button>
        </div>
      </section>
    );
  }

  const currentExercise =
    phase === "exercise" || phase === "rest"
      ? session.exercises[currentExerciseIndex]
      : null;
  const totalExercises = session.exercises.length;

  const getTimerDuration = () => {
    if (phase === "countdown") return 5;
    if (phase === "rest") return customRestTime;
    if (currentExercise) {
      return (
        customDurations[currentExercise.exercise.id] || currentExercise.duration
      );
    }
    return 0;
  };

  // Page de fin de séance
  if (phase === "completed") {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="w-24 h-24 text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-50 mb-4">
            Séance terminée !
          </h1>
          <p className="text-lg text-neutral-300 mb-2">Félicitations 🎉</p>
          <p className="text-neutral-400 mb-8">
            Vous avez complété {totalExercises} exercice
            {totalExercises > 1 ? "s" : ""}
          </p>
          <button onClick={handleExit} className="btn-primary w-full">
            Retour aux séances
          </button>
        </div>
      </section>
    );
  }

  // Page principale du player
  return (
    <section className="h-screen flex flex-col bg-gradient-to-b from-neutral-950 to-neutral-900 relative overflow-hidden -top-15">
      {/* Header avec bouton quitter */}
      <div className="absolute top-19 right-4 z-10">
        <button
          onClick={handleExit}
          className="p-2.5 rounded-full bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-50 transition-all"
          aria-label="Quitter"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Phase: Countdown */}
        {phase === "countdown" && (
          <div className="text-center space-y-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-50">
              Préparez-vous !
            </h2>
            <CircularTimer
              duration={5}
              timeRemaining={timeRemaining}
              isPaused={isPaused}
              variant="countdown"
              size={280}
            />
            <p className="text-neutral-400">
              La séance commence dans {timeRemaining}...
            </p>
          </div>
        )}

        {/* Phase: Exercise */}
        {phase === "exercise" && currentExercise && (
          <div className="w-full max-w-md text-center space-y-6">
            {/* Progression */}
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
              <span>
                Exercice {currentExerciseIndex + 1} / {totalExercises}
              </span>
            </div>

            {/* Nom de l'exercice - titre réduit */}
            <div className="px-4 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-50 mb-1">
                {currentExercise.exercise.name}
              </h2>
              {currentExercise.exercise.description && (
                <p className="text-sm text-neutral-400">
                  {currentExercise.exercise.description}
                </p>
              )}
            </div>

            {/* Image avec timer circulaire autour */}
            <div className="relative flex items-center justify-center pb-4 pt-14">
              {currentExercise.exercise.image ? (
                <div className="relative">
                  {/* Timer circulaire en arrière-plan */}
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-full"
                    style={{ transform: "scale(1.15)" }}
                  >
                    <CircularTimer
                      duration={getTimerDuration()}
                      timeRemaining={timeRemaining}
                      isPaused={isPaused}
                      variant="exercise"
                      size={340}
                      hideText
                    />
                  </div>
                  {/* Image au centre */}
                  <div className="relative w-72 h-72 rounded-full overflow-hidden bg-neutral-800 border-4 border-neutral-900">
                    <img
                      src={`http://localhost:4000${currentExercise.exercise.image}`}
                      alt={currentExercise.exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                // Si pas d'image, afficher juste le timer
                <CircularTimer
                  duration={getTimerDuration()}
                  timeRemaining={timeRemaining}
                  isPaused={isPaused}
                  variant="exercise"
                  size={320}
                />
              )}
            </div>

            {/* Temps restant sous l'image */}
            <div className="text-center mt-8">
              <div className="text-4xl sm:text-5xl font-bold text-neutral-50 tabular-nums mb-1">
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, "0")}
              </div>
              {isPaused && (
                <div className="text-sm text-neutral-400 animate-pulse">
                  En pause
                </div>
              )}
            </div>

            {/* Bouton pause/reprendre */}
            <div className="flex justify-center px-4">
              <button
                onClick={togglePause}
                className="btn-primary px-8 py-3 text-base w-full max-w-xs"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Reprendre
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                )}
              </button>
            </div>

            {/* Prochain exercice */}
            {currentExerciseIndex < totalExercises - 1 && (
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 px-4">
                <span>Suivant:</span>
                <ChevronRight className="w-3 h-3" />
                <span className="truncate max-w-[200px]">
                  {session.exercises[currentExerciseIndex + 1].exercise.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Phase: Rest */}
        {phase === "rest" && (
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Coffee className="w-8 h-8 text-cyan-400" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-50">
                Temps de repos
              </h2>
            </div>

            <CircularTimer
              duration={customRestTime}
              timeRemaining={timeRemaining}
              isPaused={isPaused}
              variant="rest"
              size={280}
            />

            {/* Prochain exercice */}
            {currentExerciseIndex < totalExercises - 1 && (
              <div className="space-y-2">
                <p className="text-neutral-400">Prochain exercice:</p>
                <p className="text-xl text-neutral-50 font-semibold">
                  {session.exercises[currentExerciseIndex + 1].exercise.name}
                </p>
              </div>
            )}

            {/* Bouton pause/reprendre */}
            <div className="flex justify-center">
              <button
                onClick={togglePause}
                className="btn-primary px-8 py-3 text-lg"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Reprendre
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barre de progression globale en bas */}
      <div className="w-full bg-neutral-900/50 backdrop-blur-sm border-t border-neutral-800 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
              style={{
                width: `${((currentExerciseIndex + (phase === "rest" ? 1 : 0)) / totalExercises) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal de confirmation de sortie */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold text-neutral-50 mb-3">
              Quitter la séance ?
            </h3>
            <p className="text-neutral-400 mb-6">
              Votre progression ne sera pas sauvegardée.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                onClick={confirmExit}
                className="btn-primary flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
