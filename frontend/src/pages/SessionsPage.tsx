import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Star, Heart, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useSessions } from "@/hooks/useSessions";
import { useSessionRating } from "@/hooks/useSessionRating";
import { useFavoriteSessions } from "@/hooks/useFavoriteSessions";
import { SessionBuilder } from "@/components/SessionBuilder";
import { StarRating } from "@/components/StarRating";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterButton } from "@/components/ui/FilterButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getCategoryColor,
  getDifficultyColor,
  formatDuration,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { FilterCategoryType, SortOrderType } from "@/types";

export const SessionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [filterCategory, setFilterCategory] =
    useState<FilterCategoryType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("desc");
  const [showModal, setShowModal] = useState(false);

  const { sessions, loading, loadSessions, deleteSession } = useSessions(
    filterCategory,
    sortOrder
  );

  const { favorites, togglingFavorite, toggleFavorite } = useFavoriteSessions();

  const handleToggleFavorite = async (
    sessionId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    await toggleFavorite(sessionId);
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
        <LoadingState />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <PageHeader
        title="Séances d'entraînement"
        action={
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <option value="desc">Meilleures notes</option>
            <option value="asc">Notes les plus basses</option>
          </select>
        }
      />

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterButton
            active={filterCategory === "all"}
            onClick={() => setFilterCategory("all")}
          >
            Toutes
          </FilterButton>
          <FilterButton
            active={filterCategory === "Musculation"}
            onClick={() => setFilterCategory("Musculation")}
            color="red"
          >
            Musculation
          </FilterButton>
          <FilterButton
            active={filterCategory === "Yoga"}
            onClick={() => setFilterCategory("Yoga")}
            color="blue"
          >
            Yoga
          </FilterButton>
          <FilterButton
            active={filterCategory === "Mobilité"}
            onClick={() => setFilterCategory("Mobilité")}
            color="green"
          >
            Mobilité
          </FilterButton>
          <FilterButton
            active={filterCategory === "Mixte"}
            onClick={() => setFilterCategory("Mixte")}
            color="purple"
          >
            Mixte
          </FilterButton>
        </div>
      </div>

      {/* Sessions grid */}
      {sessions.length === 0 ? (
        <EmptyState message="Aucune séance trouvée. Créez-en une !" />
      ) : (
        <SessionGrid
          sessions={sessions}
          favorites={favorites}
          togglingFavorite={togglingFavorite}
          user={user}
          onNavigate={navigate}
          onToggleFavorite={handleToggleFavorite}
          onDelete={deleteSession}
          onReload={loadSessions}
        />
      )}

      {/* Modal de création */}
      {showModal && (
        <SessionBuilder
          onClose={() => setShowModal(false)}
          onSuccess={loadSessions}
        />
      )}
    </section>
  );
};

// Composant SessionGrid
interface SessionGridProps {
  sessions: any[];
  favorites: Set<string>;
  togglingFavorite: string | null;
  user: any;
  onNavigate: any;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const SessionGrid = ({
  sessions,
  favorites,
  togglingFavorite,
  user,
  onNavigate,
  onToggleFavorite,
  onDelete,
  onReload,
}: SessionGridProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => {
        const color = getCategoryColor(session.category);
        const exerciseCount = session.exercises?.length || 0;
        const {
          showModal,
          selectedRating,
          submitting,
          setSelectedRating,
          openModal,
          closeModal,
          submitRating,
        } = useSessionRating(session.id, onReload);

        return (
          <div
            key={session.id}
            className="rounded-2xl border border-neutral-800/90 bg-neutral-950/90 overflow-hidden group hover:border-neutral-700 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-neutral-50 flex-1 pr-2">
                  {session.name}
                </h3>
                <span
                  className={cn(
                    "text-[0.65rem] px-2 py-0.5 rounded-full whitespace-nowrap",
                    color === "red" && "bg-red-500/20 text-red-300",
                    color === "blue" && "bg-blue-500/20 text-blue-300",
                    color === "green" && "bg-green-500/20 text-green-300",
                    color === "purple" && "bg-purple-500/20 text-purple-300"
                  )}
                >
                  {session.category}
                </span>
              </div>

              <p className="text-xs text-neutral-400 mb-4 line-clamp-2">
                {session.description}
              </p>

              <SessionMeta
                exerciseCount={exerciseCount}
                duration={session.duration}
                difficulty={session.difficulty}
              />

              <div className="flex items-center justify-between mb-4">
                <StarRating
                  rating={session.rating || 0}
                  ratingCount={session.ratingCount || 0}
                  size="sm"
                />
                {session.createdBy && (
                  <CreatorInfo
                    username={session.createdBy}
                    profileImage={session.creator?.profileImage}
                  />
                )}
              </div>

              <SessionActions
                sessionId={session.id}
                isFavorite={favorites.has(session.id)}
                isToggling={togglingFavorite === session.id}
                isOwner={user && session.creator?.id === user.id}
                onNavigate={() =>
                  onNavigate({ to: `/session-details/${session.id}` })
                }
                onToggleFavorite={(e: React.MouseEvent) =>
                  onToggleFavorite(session.id, e)
                }
                onRate={openModal}
                onDelete={() => onDelete(session.id)}
              />
            </div>

            {/* Modal de notation */}
            {showModal && (
              <RatingModal
                sessionName={session.name}
                selectedRating={selectedRating}
                submitting={submitting}
                onSetRating={setSelectedRating}
                onClose={closeModal}
                onSubmit={submitRating}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Composants auxiliaires
const SessionMeta = ({ exerciseCount, duration, difficulty }: any) => (
  <div className="flex items-center gap-3 mb-3 text-xs text-neutral-400">
    <div className="flex items-center gap-1">
      <span>{exerciseCount} exercices</span>
    </div>
    <div className="flex items-center gap-1">
      <span>{formatDuration(duration)}</span>
    </div>
    <span className={cn("font-medium", getDifficultyColor(difficulty))}>
      {difficulty}
    </span>
  </div>
);

const CreatorInfo = ({ username, profileImage }: any) => (
  <div className="flex items-center gap-1 text-[0.65rem] text-neutral-400">
    {profileImage ? (
      <img
        src={`http://localhost:4000${profileImage}`}
        alt={username}
        className="w-3 h-3 rounded-full object-cover"
      />
    ) : (
      <span>👤</span>
    )}
    <span>{username}</span>
  </div>
);

const SessionActions = ({
  isFavorite,
  isToggling,
  isOwner,
  onNavigate,
  onToggleFavorite,
  onRate,
  onDelete,
}: any) => (
  <div className="flex items-center gap-2">
    <button onClick={onNavigate} className="flex-1 btn-primary py-2 text-sm">
      Détails
    </button>

    <button
      onClick={onToggleFavorite}
      disabled={isToggling}
      className={cn(
        "h-9 w-9 rounded-full border transition-all duration-300 flex items-center justify-center",
        isFavorite
          ? "border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-red-400 hover:border-red-500/50"
      )}
    >
      <Heart className={cn("w-3.5 h-3.5", isFavorite && "fill-current")} />
    </button>

    <button
      onClick={onRate}
      className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/50 transition-colors flex items-center justify-center"
    >
      <Star className="w-3.5 h-3.5" />
    </button>

    {isOwner && (
      <button
        onClick={onDelete}
        className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-red-300 hover:border-red-500/50 transition-colors flex items-center justify-center"
        title="Supprimer cette séance"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

const RatingModal = ({
  sessionName,
  selectedRating,
  submitting,
  onSetRating,
  onClose,
  onSubmit,
}: any) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full">
      <h2 className="text-xl font-semibold text-neutral-50 mb-2">
        Noter "{sessionName}"
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
