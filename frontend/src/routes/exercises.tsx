import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { exerciseService } from "@/services/exercises";
import type { Exercise } from "@/services/exercises";
import {
  Dumbbell,
  Flower2,
  StretchHorizontal,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exercises")({
  component: ExercisesPage,
});

function ExercisesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    loadExercises();
  }, [isAuthenticated, filterCategory]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getCommunityExercises(
        filterCategory !== "all" ? filterCategory : undefined
      );
      setExercises(data);
    } catch (err) {
      console.error("Erreur chargement exercices:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Musculation":
        return Dumbbell;
      case "Yoga":
        return Flower2;
      case "Mobilité":
        return StretchHorizontal;
      default:
        return Dumbbell;
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
      default:
        return "red";
    }
  };

  if (!isAuthenticated) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50">
            Exercices
          </h1>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
            filterCategory === "all"
              ? "bg-sky-500 text-neutral-950"
              : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
          )}
        >
          Tous
        </button>
        <button
          onClick={() => setFilterCategory("Musculation")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
            filterCategory === "Musculation"
              ? "bg-red-500 text-neutral-950"
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
              ? "bg-blue-500 text-neutral-950"
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
              ? "bg-green-500 text-neutral-950"
              : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
          )}
        >
          Mobilité
        </button>
      </div>

      {/* Exercises grid */}
      {loading ? (
        <div className="text-center py-12 text-neutral-400">Chargement...</div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          Aucun exercice communautaire disponible
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => {
            const Icon = getCategoryIcon(exercise.category);
            const color = getCategoryColor(exercise.category);

            return (
              <div
                key={exercise.id}
                className="rounded-2xl border border-neutral-800/90 bg-neutral-950/90 overflow-hidden group hover:border-neutral-700 transition-colors"
              >
                <div className="h-28 bg-neutral-900 relative">
                  {exercise.image && (
                    <img
                      src={`http://localhost:4000${exercise.image}`}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div
                    className={cn(
                      "absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center",
                      color === "red" && "bg-red-500/20",
                      color === "blue" && "bg-blue-500/20",
                      color === "green" && "bg-green-500/20"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        color === "red" && "text-red-300",
                        color === "blue" && "text-blue-300",
                        color === "green" && "text-green-300"
                      )}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-neutral-50 mb-1">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                    {exercise.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span
                        className={cn(
                          "text-[0.65rem] px-2 py-0.5 rounded-full",
                          color === "red" && "bg-red-500/20 text-red-300",
                          color === "blue" && "bg-blue-500/20 text-blue-300",
                          color === "green" && "bg-green-500/20 text-green-300"
                        )}
                      >
                        {exercise.subcategory}
                      </span>
                    </div>
                    {exercise.creator?.username && (
                      <div className="flex items-center gap-1 text-[0.65rem] text-neutral-400">
                        {exercise.creator.profileImage ? (
                          <img
                            src={`http://localhost:4000${exercise.creator.profileImage}`}
                            alt={exercise.creator.username}
                            className="w-3 h-3 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-3 h-3" />
                        )}
                        <span>{exercise.creator.username}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
