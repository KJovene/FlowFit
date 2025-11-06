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

const ExerciseList = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const categories = ["Musculation", "Yoga", "Mobilité"];
  const subcategories = ["Dos", "Haut du corps", "Bassin", "Bas de corps"];

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedCategory && selectedSubcategory) {
          response = await exerciseAPI.getExercisesBySubcategory(
            selectedCategory,
            selectedSubcategory
          );
        } else if (selectedCategory) {
          response = await exerciseAPI.getExercisesByCategory(selectedCategory);
        } else {
          response = await exerciseAPI.getAllExercises();
        }
        setExercises(response.data.exercises);
      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedCategory, selectedSubcategory]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Exercices</h1>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => {
                  setSelectedCategory(e.target.value || null);
                  setSelectedSubcategory(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-catégorie
              </label>
              <select
                value={selectedSubcategory || ""}
                onChange={(e) => setSelectedSubcategory(e.target.value || null)}
                disabled={!selectedCategory}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Toutes les sous-catégories</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
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
                  <div className="flex gap-2 mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {exercise.category}
                    </span>
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

export default ExerciseList;
