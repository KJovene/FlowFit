import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Play, Star, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUserSessions } from "@/hooks/useUserSessions";
import { useSessionRating } from "@/hooks/useSessionRating";
import { SessionBuilder } from "@/components/SessionBuilder";
import { StarRating } from "@/components/StarRating";
import { PageHeader } from "@/components/ui/PageHeader";
import { BackButton } from "@/components/ui/BackButton";
import { FilterButton } from "@/components/ui/FilterButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getCategoryColor,
  getDifficultyColor,
  formatDuration,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Lock, Share2, User } from "lucide-react";
import type {
  FilterCategoryType,
  FilterSharedType,
  SortOrderType,
} from "@/types";

export const MySessionsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [filterCategory, setFilterCategory] =
    useState<FilterCategoryType>("all");
  const [filterShared, setFilterShared] = useState<FilterSharedType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("desc");
  const [showModal, setShowModal] = useState(false);

  const {
    sessions,
    loading,
    loadSessions,
    deleteSession,
    sharedCount,
    privateCount,
  } = useUserSessions(filterShared, sortOrder);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const filteredByCategory = sessions.filter(
    (session) => filterCategory === "all" || session.category === filterCategory
  );

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <BackButton
        onClick={() => navigate({ to: "/profile" })}
        label="Retour au profil"
      />

      <PageHeader
        title="Mes Séances"
        subtitle="Gérez vos séances personnelles et partagées"
        action={
          <>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
              className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <option value="desc">Meilleures notes</option>
              <option value="asc">Notes les plus basses</option>
            </select>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle séance
            </button>
          </>
        }
      />

      {/* Filter buttons - Shared/Private */}
      <div className="mb-4">
        <p className="text-xs text-neutral-400 mb-2">Visibilité</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterButton
            active={filterShared === "all"}
            onClick={() => setFilterShared("all")}
            color="cyan"
          >
            Toutes ({sessions.length})
          </FilterButton>
          <FilterButton
            active={filterShared === "shared"}
            onClick={() => setFilterShared("shared")}
            color="cyan"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Partagées ({sharedCount})
          </FilterButton>
          <FilterButton
            active={filterShared === "private"}
            onClick={() => setFilterShared("private")}
            color="amber"
          >
            <Lock className="w-3.5 h-3.5 mr-1" />
            Privées ({privateCount})
          </FilterButton>
        </div>
      </div>

      {/* Filter buttons - Category */}
      <div className="mb-6">
        <p className="text-xs text-neutral-400 mb-2">Catégorie</p>
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
      {loading ? (
        <LoadingState />
      ) : filteredByCategory.length === 0 ? (
        <EmptyState
          message={
            filterShared === "all"
              ? "Vous n'avez pas encore créé de séance"
              : filterShared === "shared"
                ? "Aucune séance partagée"
                : "Aucune séance privée"
          }
        />
      ) : (
        <MySessionsGrid
          sessions={filteredByCategory}
          user={user}
          onNavigate={navigate}
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

// Composant MySessionsGrid
interface MySessionsGridProps {
  sessions: any[];
  user: any;
  onNavigate: any;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const MySessionsGrid = ({
  sessions,
  user,
  onNavigate,
  onDelete,
  onReload,
}: MySessionsGridProps) => {
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
            className="rounded-2xl border border-neutral-800/90 bg-neutral-950/90 overflow-hidden group hover:border-neutral-700 transition-colors relative"
          >
            {/* Badge Privée */}
            {!session.isShared && (
              <div className="absolute top-4 right-16 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs backdrop-blur-sm">
                  <Lock className="w-3 h-3" />
                  Privée
                </span>
              </div>
            )}

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

              <div className="flex items-center gap-3 mb-3 text-xs text-neutral-400">
                <span>{exerciseCount} exercices</span>
                <span>{formatDuration(session.duration)}</span>
                <span
                  className={cn(
                    "font-medium",
                    getDifficultyColor(session.difficulty)
                  )}
                >
                  {session.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <StarRating
                  rating={session.rating || 0}
                  ratingCount={session.ratingCount || 0}
                  size="sm"
                />
                {session.createdBy && (
                  <div className="flex items-center gap-1 text-[0.65rem] text-neutral-400">
                    <User className="w-3 h-3" />
                    <span>{session.createdBy}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onNavigate({ to: `/session-details/${session.id}` })
                  }
                  className="flex-1 btn-primary py-2 text-sm"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Démarrer
                </button>

                <button
                  onClick={openModal}
                  className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/50 transition-colors flex items-center justify-center"
                  title="Noter cette séance"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>

                {user && session.creator?.id === user.id && (
                  <button
                    onClick={() => onDelete(session.id)}
                    className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-red-300 hover:border-red-500/50 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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

// Composant RatingModal
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
