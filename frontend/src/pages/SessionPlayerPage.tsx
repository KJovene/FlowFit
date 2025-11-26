import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import {
  Pause,
  Play,
  X,
  CheckCircle2,
  ChevronRight,
  Coffee,
} from "lucide-react";
import { CircularTimer } from "@/components/CircularTimer";
import { useSessionPlayer } from "@/hooks/useSessionPlayer";

interface SessionPlayerPageProps {
  sessionId: string;
  restTime?: number;
  durations?: Record<string, number>;
}

/**
 * Page du lecteur de séance
 * Gère la lecture séquentielle des exercices avec timer
 */
export const SessionPlayerPage = ({
  sessionId,
  restTime,
  durations,
}: SessionPlayerPageProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    session,
    loading,
    phase,
    currentExercise,
    currentExerciseIndex,
    totalExercises,
    timeRemaining,
    isPaused,
    showExitConfirm,
    setShowExitConfirm,
    togglePause,
    handleExit,
    confirmExit,
    getTimerDuration,
    progressPercentage,
    customRestTime,
  } = useSessionPlayer({ sessionId, restTime, durations });

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

            {/* Nom de l'exercice */}
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

            {/* Image avec timer */}
            <div className="relative flex items-center justify-center pb-4 pt-14">
              {currentExercise.exercise.image ? (
                <div className="relative">
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
                  <div className="relative w-72 h-72 rounded-full overflow-hidden bg-neutral-800 border-4 border-neutral-900">
                    <img
                      src={`http://localhost:4000${currentExercise.exercise.image}`}
                      alt={currentExercise.exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <CircularTimer
                  duration={getTimerDuration()}
                  timeRemaining={timeRemaining}
                  isPaused={isPaused}
                  variant="exercise"
                  size={320}
                />
              )}
            </div>

            {/* Temps restant */}
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

      {/* Barre de progression globale */}
      <div className="w-full bg-neutral-900/50 backdrop-blur-sm border-t border-neutral-800 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
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
};
