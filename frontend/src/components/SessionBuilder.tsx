import { useState, useEffect } from "react";
import { exerciseService } from "@/services/exercises";
import { sessionService } from "@/services/sessions";
import type { Exercise } from "@/services/exercises";
import type { CreateSessionData } from "@/services/sessions";
import { X, Trash2, GripVertical } from "lucide-react";

interface ExerciseInSession {
  exerciseId: string;
  exercise?: Exercise;
  order: number;
  duration: number; // durée en secondes
}

interface SessionBuilderProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SessionBuilder({ onClose, onSuccess }: SessionBuilderProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseInSession[]
  >([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "Musculation" | "Yoga" | "Mobilité" | "Mixte"
  >("Musculation");
  const [difficulty, setDifficulty] = useState<
    "Facile" | "Moyen" | "Difficile"
  >("Facile");
  const [restTime, setRestTime] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    // Filtrer les exercices selon la catégorie sélectionnée
    if (category === "Mixte") {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter((ex) => ex.category === category));
    }
  }, [category, exercises]);

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (err) {
      console.error("Erreur chargement exercices:", err);
    }
  };

  const addExercise = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const newExercise: ExerciseInSession = {
      exerciseId,
      exercise,
      order: selectedExercises.length + 1,
      duration: 30, // 30 secondes par défaut
    };

    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    // Réorganiser les ordres
    updated.forEach((ex, i) => {
      ex.order = i + 1;
    });
    setSelectedExercises(updated);
  };

  const updateExercise = (
    index: number,
    field: keyof ExerciseInSession,
    value: any
  ) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const moveExercise = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === selectedExercises.length - 1)
    ) {
      return;
    }

    const updated = [...selectedExercises];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    // Réorganiser les ordres
    updated.forEach((ex, i) => {
      ex.order = i + 1;
    });
    setSelectedExercises(updated);
  };

  const calculateTotalDuration = () => {
    const exercisesDuration = selectedExercises.reduce((total, ex) => {
      return total + ex.duration;
    }, 0);
    const totalRestTime = (selectedExercises.length - 1) * restTime;
    return exercisesDuration + totalRestTime;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Veuillez remplir le nom de la séance");
      return;
    }

    if (selectedExercises.length === 0) {
      setError("Veuillez ajouter au moins un exercice");
      return;
    }

    setLoading(true);

    try {
      const sessionData: CreateSessionData = {
        name,
        description,
        category,
        difficulty,
        restTime,
        exercises: selectedExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          order: ex.order,
          duration: ex.duration,
        })),
      };

      await sessionService.create(sessionData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}min ${secs}s` : `${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] flex flex-col my-8">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-neutral-50">
            Créer une séance
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-neutral-50 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/50 bg-red-500/10 text-red-200 text-sm flex-shrink-0">
            {error}
          </div>
        )}

        <form
          id="session-form"
          onSubmit={handleSubmit}
          className="space-y-6 overflow-y-auto flex-1 pr-2"
        >
          {/* Informations générales */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-200 mb-1.5">
                Nom de la séance
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                placeholder="Ex: Séance pectoraux débutant"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-200 mb-1.5">
                Description (optionnelle)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all resize-none"
                placeholder="Description de la séance..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1.5">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | "Musculation"
                      | "Yoga"
                      | "Mobilité"
                      | "Mixte"
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              >
                <option value="Musculation">Musculation</option>
                <option value="Yoga">Yoga</option>
                <option value="Mobilité">Mobilité</option>
                <option value="Mixte">Mixte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1.5">
                Difficulté
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value as "Facile" | "Moyen" | "Difficile"
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1.5">
                Repos entre exercices
              </label>
              <select
                value={restTime}
                onChange={(e) => setRestTime(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              >
                <option value={5}>5 secondes</option>
                <option value={10}>10 secondes</option>
                <option value={15}>15 secondes</option>
                <option value={20}>20 secondes</option>
              </select>
            </div>
          </div>

          {/* Ajouter des exercices */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">
              Ajouter des exercices
              {category !== "Mixte" && (
                <span className="text-xs text-neutral-400 ml-2">
                  (Exercices de {category} uniquement)
                </span>
              )}
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addExercise(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
            >
              <option value="">Sélectionner un exercice...</option>
              {filteredExercises
                .filter(
                  (ex) => !selectedExercises.find((s) => s.exerciseId === ex.id)
                )
                .map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name} - {exercise.category}
                  </option>
                ))}
            </select>
          </div>

          {/* Liste des exercices sélectionnés */}
          {selectedExercises.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-200">
                  Exercices de la séance ({selectedExercises.length})
                </h3>
                <span className="text-xs text-neutral-400">
                  Durée totale: {formatDuration(calculateTotalDuration())}
                </span>
              </div>

              <div className="space-y-2">
                {selectedExercises.map((ex, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {/* Drag handle & Order */}
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => moveExercise(index, "up")}
                          disabled={index === 0}
                          className="text-neutral-500 hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-semibold text-neutral-400">
                          {ex.order}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveExercise(index, "down")}
                          disabled={index === selectedExercises.length - 1}
                          className="text-neutral-500 hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <GripVertical className="w-4 h-4 rotate-180" />
                        </button>
                      </div>

                      {/* Exercise details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-neutral-50">
                              {ex.exercise?.name}
                            </h4>
                            <p className="text-xs text-neutral-400">
                              {ex.exercise?.category}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-neutral-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">
                              Durée (secondes)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={ex.duration}
                              onChange={(e) =>
                                updateExercise(
                                  index,
                                  "duration",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="flex gap-3 pt-4 flex-shrink-0 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-secondary py-2.5"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="session-form"
            disabled={loading || selectedExercises.length === 0}
            className="flex-1 btn-primary py-2.5 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer la séance"}
          </button>
        </div>
      </div>
    </div>
  );
}
