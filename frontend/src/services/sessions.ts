const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

import type { Exercise } from "./exercises";

export interface SessionExercise {
  exercise: Exercise;
  order: number;
  duration: number; // durée en secondes
}

export interface Session {
  id: string;
  name: string;
  description: string;
  category: "Musculation" | "Yoga" | "Mobilité" | "Mixte";
  difficulty: "Facile" | "Moyen" | "Difficile";
  duration: number; // durée totale en secondes
  restTime: number; // temps de repos entre exercices en secondes (5, 10, 15, 20)
  image?: string;
  exercises?: SessionExercise[];
  createdAt: string;
  rating: number; // note moyenne sur 5
  ratingCount: number; // nombre de notes
  isShared: boolean; // si la séance est partagée avec la communauté
  createdBy?: string;
  creator?: {
    id: string;
    username: string;
  };
}

export interface CreateSessionData {
  name: string;
  description: string;
  category: "Musculation" | "Yoga" | "Mobilité" | "Mixte";
  difficulty: "Facile" | "Moyen" | "Difficile";
  restTime: number;
  exercises: {
    exerciseId: string;
    order: number;
    duration: number;
  }[];
}

export const sessionService = {
  async getAll(category?: string): Promise<Session[]> {
    const token = localStorage.getItem("token");
    const url = category
      ? `${API_URL}/sessions?category=${category}`
      : `${API_URL}/sessions`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data || [];
  },

  async getById(id: string): Promise<Session> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data;
  },

  async create(sessionData: CreateSessionData): Promise<Session> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    const data = await response.json();
    return data.data;
  },

  async update(
    id: string,
    sessionData: Partial<CreateSessionData>
  ): Promise<Session> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    const data = await response.json();
    return data.data;
  },

  async delete(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/sessions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async rate(
    id: string,
    rating: number
  ): Promise<{ rating: number; ratingCount: number; userRating: number }> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}/rate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    const data = await response.json();
    return data.data;
  },

  async getUserRating(id: string): Promise<number | null> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}/user-rating`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data.userRating;
  },

  async share(id: string): Promise<Session> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}/share`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  async toggleShare(id: string): Promise<Session> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}/toggle-share`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  async getUserSessions(shared?: boolean): Promise<Session[]> {
    const token = localStorage.getItem("token");
    let url = `${API_URL}/sessions/my-sessions`;
    if (shared !== undefined) {
      url += `?shared=${shared}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data || [];
  },

  async addToFavorites(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  async removeFromFavorites(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}/favorite`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  async getFavoriteSessions(): Promise<Session[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data || [];
  },

  async checkIfFavorite(id: string): Promise<boolean> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sessions/${id}/is-favorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.data.isFavorite;
  },
};
