import React, { useState } from "react";
import { exerciseAPI } from "../services/exerciseService";

const CATEGORIES = {
  Musculation: ["Dos", "Haut du corps", "Bassin", "Bas de corps"],
  Yoga: ["Dos", "Haut du corps", "Bassin", "Bas de corps"],
  Mobilité: ["Dos", "Haut du corps", "Bassin", "Bas de corps"],
};

const Add = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Musculation",
    subcategory: "Dos",
    type: "Quantité",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Afficher l'aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.image) {
      setMessage("Veuillez télécharger une image");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("subcategory", formData.subcategory);
      form.append("type", formData.type);
      form.append("image", formData.image);

      const response = await exerciseAPI.createExercise(form);

      if (response.data.success) {
        setMessage("Exercice créé avec succès!");
        setMessageType("success");
        // Réinitialiser le formulaire
        setFormData({
          name: "",
          description: "",
          category: "Musculation",
          subcategory: "Dos",
          type: "Quantité",
          image: null,
        });
        setImagePreview(null);
      }
    } catch (error) {
      setMessage("Erreur lors de la création de l'exercice");
      setMessageType("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Ajouter un exercice
        </h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de l'exercice */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'exercice *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Pompes"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez l'exercice..."
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="Musculation">Musculation</option>
              <option value="Yoga">Yoga</option>
              <option value="Mobilité">Mobilité</option>
            </select>
          </div>

          {/* Sous-catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sous-catégorie *
            </label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {CATEGORIES[formData.category as keyof typeof CATEGORIES]?.map(
                (sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Type d'exercice */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'exercice *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="Quantité">Quantité (répétitions, kg, etc.)</option>
              <option value="Temps">Temps (durée, secondes, etc.)</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required
                className="w-full"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="max-h-64 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bouton d'envoi */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Création en cours..." : "Créer l'exercice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
