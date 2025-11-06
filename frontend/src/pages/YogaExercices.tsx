import { useState, useEffect } from "react";
import { exerciseAPI } from "../services/exerciseService";

interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  type: string;
  image: string;
  createdAt: string;
}

const YogaExercices = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const subcategories = ["Dos", "Haut du corps", "Bassin", "Bas de corps"];

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedSubcategory) {
          response = await exerciseAPI.getExercisesBySubcategory(
            "Yoga",
            selectedSubcategory
          );
        } else {
          response = await exerciseAPI.getExercisesByCategory("Yoga");
        }
        setExercises(response.data.exercises);
      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedSubcategory]);

  const handleDeleteExercise = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
      try {
        await exerciseAPI.deleteExercise(id);
        setExercises((prev) => prev.filter((ex) => ex._id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🧘 Yoga</h1>
        <p className="text-gray-600 mb-8">
          Trouvez l'équilibre et la sérénité avec nos exercices de yoga
        </p>

        {/* Filtres par sous-catégorie */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filtrer par zone de travail
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedSubcategory === null
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Tous
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedSubcategory === sub
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des exercices */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement des exercices...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600">Aucun exercice trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={`http://localhost:4000${exercise.image}`}
                  alt={exercise.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {exercise.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {exercise.description}
                  </p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {exercise.subcategory}
                    </span>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                        exercise.type === "Quantité"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {exercise.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteExercise(exercise._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YogaExercices;
