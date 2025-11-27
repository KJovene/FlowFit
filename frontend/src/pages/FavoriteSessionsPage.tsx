import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { Play, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/StarRating";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { FilterButton } from "@/components/ui/FilterButton";
import { useFavoriteSessionsFilters } from "@/hooks/useFavoriteSessionsFilters";
import { useDynamicSessionRating } from "@/hooks/useDynamicSessionRating";
import {
  formatDuration,
  getCategoryColor,
  getDifficultyColor,
} from "@/lib/formatters";

/**
 * Page des séances favorites
 * Affiche les séances favorites avec filtres, tri et notation
 */
export const FavoriteSessionsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    sessions,
    loading,
    filterCategory,
    setFilterCategory,
    sortOrder,
    setSortOrder,
    removingFavorite,
    handleRemoveFromFavorites,
    totalCount,
  } = useFavoriteSessionsFilters();

  const {
    showModal: showRatingModal,
    selectedSession: selectedSessionForRating,
    selectedRating,
    submitting: ratingSubmitting,
    openModal: handleOpenRatingModal,
    closeModal: handleCloseRatingModal,
    setSelectedRating,
    submitRating: handleRateSession,
  } = useDynamicSessionRating(() => window.location.reload());

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <BackButton onClick={() => navigate({ to: "/profile" })} />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-red-400 fill-current" />
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50">
              Séances Favorites
            </h1>
          </div>
          <p className="text-base text-neutral-300">
            Retrouvez vos séances préférées en un seul endroit
          </p>
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
          className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <option value="desc">Meilleures notes</option>
          <option value="asc">Notes les plus basses</option>
        </select>
      </div>

      {/* Filter buttons */}
      <div className="mb-6">
        <p className="text-xs text-neutral-400 mb-2">Catégorie</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterButton
            active={filterCategory === "all"}
            onClick={() => setFilterCategory("all")}
            color="sky"
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
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-400">
            {totalCount === 0
              ? "Vous n'avez pas encore de séance favorite"
              : "Aucune séance dans cette catégorie"}
          </p>
          <button
            onClick={() => navigate({ to: "/sessions" })}
            className="btn-primary px-6 py-3 mt-6"
          >
            Découvrir des séances
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => {
            const color = getCategoryColor(session.category);
            const exerciseCount = session.exercises?.length || 0;

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

                  <div className="flex items-center gap-3 mb-3 text-xs text-neutral-400">
                    <div className="flex items-center gap-1">
                      <span>{exerciseCount} exercices</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{formatDuration(session.duration)}</span>
                    </div>
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
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate({ to: `/session-details/${session.id}` })
                      }
                      className="flex-1 btn-primary py-2 text-sm"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      Démarrer
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromFavorites(session.id);
                      }}
                      disabled={removingFavorite === session.id}
                      className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors flex items-center justify-center disabled:opacity-50"
                      title="Retirer des favoris"
                    >
                      <Heart
                        className={cn(
                          "w-3.5 h-3.5 fill-current",
                          removingFavorite === session.id && "animate-pulse"
                        )}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRatingModal(session);
                      }}
                      className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/50 transition-colors flex items-center justify-center"
                      title="Noter cette séance"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de notation */}
      {showRatingModal && selectedSessionForRating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold text-neutral-50 mb-2">
              Noter "{selectedSessionForRating.name}"
            </h2>

            <p className="text-sm text-neutral-400 mb-6">
              Votre avis aide les autres utilisateurs
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
                onClick={handleCloseRatingModal}
                className="flex-1 btn-secondary py-2.5"
                disabled={ratingSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleRateSession}
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
};
