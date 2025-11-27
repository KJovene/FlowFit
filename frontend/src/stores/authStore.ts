import { create } from "zustand";
import { authService } from "@/services/auth";

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  initAuth: () => void;
  updateProfileImage: (profileImage: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email, password) => {
    try {
      const result = await authService.login({ email, password });
      if (result.success && result.token && result.user) {
        set({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  register: async (username, email, password) => {
    try {
      const result = await authService.register({
        username,
        email,
        password,
        passwordConfirm: password,
      });
      if (result.success && result.token && result.user) {
        set({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initAuth: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
      });
    }
  },

  updateProfileImage: (profileImage: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, profileImage } : null,
    }));
    // Update localStorage as well
    const user = authService.getUser();
    if (user) {
      user.profileImage = profileImage;
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
}));
