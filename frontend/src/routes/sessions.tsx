import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { sessionService } from "@/services/sessions";
import type { Session } from "@/services/sessions";
import { Plus, Play, Trash2, Clock, Target, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionBuilder } from "@/components/SessionBuilder";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/sessions")({
  component: SessionsPage,
});

function SessionsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // desc = meilleure note d'abord, asc = moins bonne note d'abord
  const [showModal, setShowModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSessionForRating, setSelectedSessionForRating] =
    useState<Session | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    loadSessions();
  }, [isAuthenticated, filterCategory, sortOrder]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getAll(
        filterCategory !== "all" ? filterCategory : undefined
      );

      // Appliquer le tri par notation
      const sortedData = [...data].sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortOrder === "desc" ? ratingB - ratingA : ratingA - ratingB;
      });

      setSessions(sortedData);
    } catch (err) {
      console.error("Erreur chargement séances:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) {
      return;
    }

    try {
      await sessionService.delete(id);
      await loadSessions();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handleOpenRatingModal = async (session: Session) => {
    setSelectedSessionForRating(session);

    // Charger la note de l'utilisateur pour cette séance
    try {
      const userRating = await sessionService.getUserRating(session.id);
      setSelectedRating(userRating || 0);
    } catch (err) {
      console.error("Erreur chargement note utilisateur:", err);
      setSelectedRating(0);
    }

    setShowRatingModal(true);
  };

  const handleRateSession = async () => {
    if (!selectedSessionForRating || selectedRating === 0) return;

    try {
      setRatingSubmitting(true);
      await sessionService.rate(selectedSessionForRating.id, selectedRating);

      // Recharger les séances pour obtenir la nouvelle note
      await loadSessions();
      setShowRatingModal(false);
      setSelectedSessionForRating(null);
      setSelectedRating(0);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "text-green-400";
      case "Moyen":
        return "text-yellow-400";
      case "Difficile":
        return "text-red-400";
      default:
        return "text-neutral-400";
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes} min` : `${seconds} sec`;
  };

  if (!isAuthenticated) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50">
            Mes séances d'entraînement
          </h1>
          <p className="text-base text-neutral-300">
            Créez et gérez vos séances personnalisées
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
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
        </div>
      </div>

      {/* Filter buttons */}
      <div className="mb-6">
        <p className="text-xs text-neutral-400 mb-2">Catégorie</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              filterCategory === "all"
                ? "bg-sky-500 text-neutral-950"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
            )}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilterCategory("Musculation")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              filterCategory === "Musculation"
                ? "bg-sky-500 text-neutral-950"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
            )}
          >
            Musculation
          </button>
          <button
            onClick={() => setFilterCategory("Yoga")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              filterCategory === "Yoga"
                ? "bg-cyan-400 text-neutral-950"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
            )}
          >
            Yoga
          </button>
          <button
            onClick={() => setFilterCategory("Mobilité")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              filterCategory === "Mobilité"
                ? "bg-blue-400 text-neutral-950"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
            )}
          >
            Mobilité
          </button>
          <button
            onClick={() => setFilterCategory("Mixte")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              filterCategory === "Mixte"
                ? "bg-purple-400 text-neutral-950"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
            )}
          >
            Mixte
          </button>
        </div>
      </div>

      {/* Sessions grid */}
      {loading ? (
        <div className="text-center py-12 text-neutral-400">Chargement...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          Aucune séance trouvée. Créez-en une !
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
                        color === "sky" && "bg-sky-500/20 text-sky-300",
                        color === "cyan" && "bg-cyan-500/20 text-cyan-300",
                        color === "blue" && "bg-blue-500/20 text-blue-300",
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
                      <Target className="w-3.5 h-3.5" />
                      <span>{exerciseCount} exercices</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
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
                        handleOpenRatingModal(session);
                      }}
                      className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/50 transition-colors flex items-center justify-center"
                      title="Noter cette séance"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(session.id)}
                      className="h-9 w-9 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-red-300 hover:border-red-500/50 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de création */}
      {showModal && (
        <SessionBuilder
          onClose={() => setShowModal(false)}
          onSuccess={loadSessions}
        />
      )}

      {/* Modal de notation */}
      {showRatingModal && selectedSessionForRating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold text-neutral-50 mb-2">
              Noter "{selectedSessionForRating.name}"
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
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedSessionForRating(null);
                  setSelectedRating(0);
                }}
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
}
