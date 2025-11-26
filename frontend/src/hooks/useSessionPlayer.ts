import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";

type Phase = "countdown" | "exercise" | "rest" | "completed";

interface SessionPlayerConfig {
  sessionId: string;
  restTime?: number;
  durations?: Record<string, number>;
}

/**
 * Hook de gestion du lecteur de séance
 * Gère le timer, les phases (compte à rebours, exercice, repos, terminé), pause et progression
 */
export const useSessionPlayer = ({
  sessionId,
  restTime = 10,
  durations = {},
}: SessionPlayerConfig) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("countdown");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5); // Countdown initial 5s
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const customRestTime = restTime;
  const customDurations = durations;

  // Bloquer le scroll sur cette page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

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

  const getTimerDuration = () => {
    if (phase === "countdown") return 5;
    if (phase === "rest") return customRestTime;
    if (session?.exercises && currentExerciseIndex < session.exercises.length) {
      const currentExercise = session.exercises[currentExerciseIndex];
      return (
        customDurations[currentExercise.exercise.id] || currentExercise.duration
      );
    }
    return 0;
  };

  const currentExercise =
    session?.exercises && (phase === "exercise" || phase === "rest")
      ? session.exercises[currentExerciseIndex]
      : null;

  const totalExercises = session?.exercises?.length || 0;
  const progressPercentage =
    totalExercises > 0
      ? ((currentExerciseIndex + (phase === "rest" ? 1 : 0)) / totalExercises) *
        100
      : 0;

  return {
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
  };
};
