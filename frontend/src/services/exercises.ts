const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: "Musculation" | "Yoga" | "Mobilité";
  subcategory: "Dos" | "Haut du corps" | "Bassin" | "Bas de corps";
  image: string;
  createdAt: string;
  createdBy?: string;
  creator?: {
    id: string;
    username: string;
  };
}

export const exerciseService = {
  async getAll(category?: string): Promise<Exercise[]> {
    const token = localStorage.getItem("token");
    const url = category
      ? `${API_URL}/exercises?category=${category}`
      : `${API_URL}/exercises`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data || [];
  },

  async getById(id: string): Promise<Exercise> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/exercises/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data;
  },

  async create(exerciseData: FormData): Promise<Exercise> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/exercises`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: exerciseData,
    });

    const data = await response.json();
    return data.data;
  },

  async update(id: string, exerciseData: FormData): Promise<Exercise> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/exercises/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: exerciseData,
    });

    const data = await response.json();
    return data.data;
  },

  async delete(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/exercises/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
