import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { exerciseService } from "@/services/exercises";
import type { Exercise } from "@/services/exercises";
import {
  Plus,
  Pencil,
  Trash2,
  Dumbbell,
  Flower2,
  StretchHorizontal,
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
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Musculation",
    subcategory: "Haut du corps",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

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
      const data = await exerciseService.getAll(
        filterCategory !== "all" ? filterCategory : undefined
      );
      setExercises(data);
    } catch (err) {
      console.error("Erreur chargement exercices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exercise?: Exercise) => {
    if (exercise) {
      setEditingExercise(exercise);
      setFormData({
        name: exercise.name,
        description: exercise.description,
        category: exercise.category,
        subcategory: exercise.subcategory,
      });
    } else {
      setEditingExercise(null);
      setFormData({
        name: "",
        description: "",
        category: "Musculation",
        subcategory: "Haut du corps",
      });
      setImageFile(null);
    }
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExercise(null);
    setImageFile(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.description) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!editingExercise && !imageFile) {
      setError("Veuillez sélectionner une image");
      return;
    }

    setSubmitLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editingExercise) {
        await exerciseService.update(editingExercise.id, data);
      } else {
        await exerciseService.create(data);
      }

      await loadExercises();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
      return;
    }

    try {
      await exerciseService.delete(id);
      await loadExercises();
    } catch (err) {
      console.error("Erreur suppression:", err);
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
        return "sky";
      case "Yoga":
        return "cyan";
      case "Mobilité":
        return "blue";
      default:
        return "sky";
    }
  };

  if (!isAuthenticated) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50">
            Gestion des exercices
          </h1>
          <p className="text-base text-neutral-300">
            Créez et gérez votre bibliothèque d'exercices
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel exercice
        </button>
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
      </div>

      {/* Exercises grid */}
      {loading ? (
        <div className="text-center py-12 text-neutral-400">Chargement...</div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          Aucun exercice trouvé. Créez-en un !
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
                <div className="aspect-video bg-neutral-900 relative">
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
                      color === "sky" && "bg-sky-500/20",
                      color === "cyan" && "bg-cyan-500/20",
                      color === "blue" && "bg-blue-500/20"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        color === "sky" && "text-sky-300",
                        color === "cyan" && "text-cyan-300",
                        color === "blue" && "text-blue-300"
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
                          color === "sky" && "bg-sky-500/20 text-sky-300",
                          color === "cyan" && "bg-cyan-500/20 text-cyan-300",
                          color === "blue" && "bg-blue-500/20 text-blue-300"
                        )}
                      >
                        {exercise.subcategory}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(exercise)}
                        className="h-7 w-7 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-sky-300 hover:border-sky-500/50 transition-colors flex items-center justify-center"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(exercise.id)}
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-neutral-50 mb-6">
              {editingExercise ? "Modifier l'exercice" : "Nouvel exercice"}
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
                  Description
                </label>
                <textarea
                  required
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
                  Image {editingExercise && "(optionnel pour modification)"}
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
                  onClick={handleCloseModal}
                  className="flex-1 btn-secondary py-2.5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 btn-primary py-2.5 disabled:opacity-50"
                >
                  {submitLoading
                    ? "..."
                    : editingExercise
                      ? "Modifier"
                      : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
