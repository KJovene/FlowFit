import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Share2, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUserExercises } from "@/hooks/useUserExercises";
import { PageHeader } from "@/components/ui/PageHeader";
import { BackButton } from "@/components/ui/BackButton";
import { FilterButton } from "@/components/ui/FilterButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCategoryIcon, getCategoryColor } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type {
  FilterCategoryType,
  FilterSharedType,
  ExerciseFormData,
} from "@/types";

export const MyExercisesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [filterCategory, setFilterCategory] =
    useState<FilterCategoryType>("all");
  const [filterShared, setFilterShared] = useState<FilterSharedType>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);

  const {
    exercises,
    loading,
    loadExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    toggleShare,
    sharedCount,
    privateCount,
  } = useUserExercises(filterShared);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const filteredByCategory = exercises.filter(
    (exercise) =>
      filterCategory === "all" || exercise.category === filterCategory
  );

  const handleOpenModal = (exercise?: any) => {
    setEditingExercise(exercise || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExercise(null);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <BackButton
        onClick={() => navigate({ to: "/profile" })}
        label="Retour au profil"
      />

      <PageHeader
        title="Mes Exercices"
        subtitle="Gérez vos exercices personnels et partagés"
        action={
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel exercice
          </button>
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
            Tous ({exercises.length})
          </FilterButton>
          <FilterButton
            active={filterShared === "shared"}
            onClick={() => setFilterShared("shared")}
            color="cyan"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Partagés ({sharedCount})
          </FilterButton>
          <FilterButton
            active={filterShared === "private"}
            onClick={() => setFilterShared("private")}
            color="amber"
          >
            <Lock className="w-3.5 h-3.5 mr-1" />
            Privés ({privateCount})
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
      </div>

      {/* Exercises grid */}
      {loading ? (
        <LoadingState />
      ) : filteredByCategory.length === 0 ? (
        <EmptyState message="Aucun exercice trouvé. Créez-en un !" />
      ) : (
        <MyExercisesGrid
          exercises={filteredByCategory}
          onEdit={handleOpenModal}
          onDelete={deleteExercise}
          onToggleShare={toggleShare}
        />
      )}

      {/* Modal */}
      {showModal && (
        <ExerciseModal
          exercise={editingExercise}
          onClose={handleCloseModal}
          onCreate={createExercise}
          onUpdate={updateExercise}
          onSuccess={loadExercises}
        />
      )}
    </section>
  );
};

// Composant MyExercisesGrid
interface MyExercisesGridProps {
  exercises: any[];
  onEdit: (exercise: any) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string) => void;
}

const MyExercisesGrid = ({
  exercises,
  onEdit,
  onDelete,
  onToggleShare,
}: MyExercisesGridProps) => {
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

              <div className="flex items-center justify-between mb-3">
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

              <div className="flex items-center justify-between">
                <button
                  onClick={() => onToggleShare(exercise.id)}
                  className={cn(
                    "h-7 px-3 rounded-full border text-[0.65rem] font-medium transition-colors flex items-center gap-1.5",
                    exercise.isShared
                      ? "border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                      : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-amber-500/50 hover:text-amber-300"
                  )}
                >
                  {exercise.isShared ? (
                    <>
                      <Share2 className="w-3 h-3" />
                      Partagé
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Privé
                    </>
                  )}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(exercise)}
                    className="h-7 w-7 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-sky-300 hover:border-sky-500/50 transition-colors flex items-center justify-center"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(exercise.id)}
                    className="h-7 w-7 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-red-300 hover:border-red-500/50 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Composant ExerciseModal
interface ExerciseModalProps {
  exercise: any;
  onClose: () => void;
  onCreate: (formData: ExerciseFormData, imageFile: File) => Promise<any>;
  onUpdate: (
    id: string,
    formData: ExerciseFormData,
    imageFile?: File
  ) => Promise<any>;
  onSuccess: () => void;
}

const ExerciseModal = ({
  exercise,
  onClose,
  onCreate,
  onUpdate,
  onSuccess,
}: ExerciseModalProps) => {
  const [formData, setFormData] = useState<ExerciseFormData>({
    name: exercise?.name || "",
    description: exercise?.description || "",
    category: exercise?.category || "Musculation",
    subcategory: exercise?.subcategory || "Haut du corps",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("Veuillez remplir le nom de l'exercice");
      return;
    }

    if (!exercise && !imageFile) {
      setError("Veuillez sélectionner une image");
      return;
    }

    setSubmitLoading(true);

    try {
      let result;
      if (exercise) {
        result = await onUpdate(exercise.id, formData, imageFile || undefined);
      } else {
        if (!imageFile) return;
        result = await onCreate(formData, imageFile);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-neutral-50 mb-6">
          {exercise ? "Modifier l'exercice" : "Nouvel exercice"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/50 bg-red-500/10 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">
              Nom de l'exercice
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              placeholder="Ex: Pompes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">
              Description (optionnelle)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all resize-none"
              placeholder="Description de l'exercice..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1.5">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              >
                <option value="Musculation">Musculation</option>
                <option value="Yoga">Yoga</option>
                <option value="Mobilité">Mobilité</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1.5">
                Sous-catégorie
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              >
                <option value="Haut du corps">Haut du corps</option>
                <option value="Bas de corps">Bas de corps</option>
                <option value="Dos">Dos</option>
                <option value="Bassin">Bassin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">
              Image {exercise && "(optionnel pour modification)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-sky-500 file:text-neutral-950 hover:file:bg-sky-600 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary py-2.5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex-1 btn-primary py-2.5 disabled:opacity-50"
            >
              {submitLoading ? "..." : exercise ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
