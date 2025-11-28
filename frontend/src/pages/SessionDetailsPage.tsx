import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Play, Clock, Settings, Star, Share2, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useSessionDetails } from "@/hooks/useSessionDetails";
import { StarRating } from "@/components/StarRating";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCategoryColor, formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface SessionDetailsPageProps {
  sessionId: string;
}

export const SessionDetailsPage = ({ sessionId }: SessionDetailsPageProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const {
    session,
    loading,
    selectedRating,
    setSelectedRating,
    rateSession,
    toggleShare,
  } = useSessionDetails(sessionId);

  const [customDurations, setCustomDurations] = useState<{
    [key: string]: number;
  }>({});
  const [customRestTime, setCustomRestTime] = useState<number>(10);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Initialiser les durées quand la session est chargée
  useState(() => {
    if (session) {
      const durations: { [key: string]: number } = {};
      session.exercises?.forEach((ex) => {
        durations[ex.exercise.id] = ex.duration;
      });
      setCustomDurations(durations);
      setCustomRestTime(session.restTime);
    }
  });

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
        <LoadingState />
      </section>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
        <EmptyState message="Séance non trouvée" />
      </section>
    );
  }

  const color = getCategoryColor(session.category);

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
    return exercisesDuration + restDuration + 5;
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
    setRatingSubmitting(true);
    const result = await rateSession(rating);
    if (result.success) {
      setShowRatingModal(false);
    } else {
      alert("Une erreur est survenue lors de la notation");
    }
    setRatingSubmitting(false);
  };

  const handleToggleShare = async () => {
    const action = session.isShared ? "retirer de" : "partager avec";
    if (
      window.confirm(
        `Voulez-vous vraiment ${action} la communauté cette séance ?`
      )
    ) {
      setIsSharing(true);
      const result = await toggleShare();
      if (result.success) {
        alert(
          session.isShared
            ? "Séance retirée de la communauté !"
            : "Séance partagée avec succès !"
        );
      } else {
        alert(result.error || "Une erreur est survenue lors du partage");
      }
      setIsSharing(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <BackButton
        onClick={() => navigate({ to: "/" })}
        label="Retour à l'accueil"
      />

      {/* Header */}
      <SessionHeader
        session={session}
        color={color}
        totalDuration={calculateTotalDuration()}
        selectedRating={selectedRating}
        user={user}
        isSharing={isSharing}
        onOpenRatingModal={() => setShowRatingModal(true)}
        onToggleShare={handleToggleShare}
      />

      {/* Configuration */}
      <SessionConfiguration
        customRestTime={customRestTime}
        onRestTimeChange={setCustomRestTime}
      />

      {/* Liste des exercices */}
      <ExercisesList
        exercises={session.exercises || []}
        customDurations={customDurations}
        onUpdateDuration={updateExerciseDuration}
      />

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
        <RatingModal
          selectedRating={selectedRating}
          submitting={ratingSubmitting}
          onSetRating={setSelectedRating}
          onClose={() => setShowRatingModal(false)}
          onSubmit={() => handleRateSession(selectedRating)}
        />
      )}
    </section>
  );
};

// Composant SessionHeader
const SessionHeader = ({
  session,
  color,
  totalDuration,
  selectedRating,
  user,
  isSharing,
  onOpenRatingModal,
  onToggleShare,
}: any) => (
  <div className="mb-8">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50 mb-2">
          {session.name}
        </h1>
        {session.description && (
          <p className="text-base text-neutral-300 mb-4">
            {session.description}
          </p>
        )}

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
            <span>{session.exercises?.length || 0} exercices</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(totalDuration)}</span>
          </div>
          {!session.isShared && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300">
              Privée
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating
              rating={session.rating || 0}
              ratingCount={session.ratingCount || 0}
              size="md"
            />
          </div>
          <button
            onClick={onOpenRatingModal}
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
              {session.creator?.profileImage ? (
                <img
                  src={session.creator.profileImage}
                  alt={session.createdBy}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>Par {session.createdBy}</span>
            </div>
          )}
        </div>
      </div>

      {user && session.creator?.id === user.id && (
        <button
          onClick={onToggleShare}
          disabled={isSharing}
          className={cn(
            "px-4 py-2 text-sm flex items-center gap-2 rounded-xl border font-medium transition-colors disabled:opacity-50",
            session.isShared
              ? "border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20"
              : "border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
          )}
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? "..." : session.isShared ? "Partagé" : "Privé"}
        </button>
      )}
    </div>
  </div>
);

// Composant SessionConfiguration
const SessionConfiguration = ({ customRestTime, onRestTimeChange }: any) => (
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
          onChange={(e) => onRestTimeChange(parseInt(e.target.value))}
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
);

// Composant ExercisesList
const ExercisesList = ({
  exercises,
  customDurations,
  onUpdateDuration,
}: any) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold text-neutral-50 mb-4">
      Exercices de la séance
    </h2>

    <div className="space-y-3">
      {exercises.map((ex: any, index: number) => (
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
                  src={ex.exercise.image}
                  alt={ex.exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-neutral-50 mb-1">
                {ex.exercise.name}
              </h3>
              {ex.exercise.description && (
                <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                  {ex.exercise.description}
                </p>
              )}

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
                          onUpdateDuration(ex.exercise.id, currentDuration - 5);
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-50 transition-colors border border-neutral-700"
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
                        onUpdateDuration(ex.exercise.id, currentDuration + 5);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-50 transition-colors border border-neutral-700"
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
);

// Composant RatingModal
const RatingModal = ({
  selectedRating,
  submitting,
  onSetRating,
  onClose,
  onSubmit,
}: any) => (
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
          onRate={onSetRating}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn-secondary py-2.5"
          disabled={submitting}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={selectedRating === 0 || submitting}
          className="flex-1 btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "..." : "Valider"}
        </button>
      </div>
    </div>
  </div>
);
