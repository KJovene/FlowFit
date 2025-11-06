import axios from "axios";

const API_URL = "http://localhost:4000/api/exercises";

export const exerciseAPI = {
  // Créer un exercice
  createExercise: async (formData: FormData) => {
    return axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Récupérer tous les exercices
  getAllExercises: async () => {
    return axios.get(API_URL);
  },

  // Récupérer les exercices par catégorie
  getExercisesByCategory: async (category: string) => {
    return axios.get(`${API_URL}/category/${category}`);
  },

  // Récupérer les exercices par catégorie et sous-catégorie
  getExercisesBySubcategory: async (category: string, subcategory: string) => {
    return axios.get(`${API_URL}/category/${category}/${subcategory}`);
  },

  // Récupérer un exercice par ID
  getExerciseById: async (id: string) => {
    return axios.get(`${API_URL}/${id}`);
  },

  // Mettre à jour un exercice
  updateExercise: async (id: string, formData: FormData) => {
    return axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Supprimer un exercice
  deleteExercise: async (id: string) => {
    return axios.delete(`${API_URL}/${id}`);
  },
};
