import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { useExercises } from "@/hooks/useExercises";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterButton } from "@/components/ui/FilterButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCategoryIcon, getCategoryColor } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { User as UserIcon } from "lucide-react";
import type { FilterCategoryType } from "@/types";

export const ExercisesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [filterCategory, setFilterCategory] =
    useState<FilterCategoryType>("all");

  const { exercises, loading } = useExercises(filterCategory);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
        <LoadingState />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <PageHeader title="Exercices" />

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <FilterButton
          active={filterCategory === "all"}
          onClick={() => setFilterCategory("all")}
        >
          Tous
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
      </div>

      {/* Exercises grid */}
      {exercises.length === 0 ? (
        <EmptyState message="Aucun exercice communautaire disponible" />
      ) : (
        <ExercisesGrid exercises={exercises} />
      )}
    </section>
  );
};

// Composant ExercisesGrid
interface ExercisesGridProps {
  exercises: any[];
}

const ExercisesGrid = ({ exercises }: ExercisesGridProps) => {
  return (
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
                  src={exercise.image}
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
              {exercise.description && (
                <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                  {exercise.description}
                </p>
              )}

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
                        src={exercise.creator.profileImage}
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
  );
};
