import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Hook de gestion du formulaire de connexion
 * Gère la validation, soumission et redirection après connexion
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const initAuth = useAuthStore((state) => state.initAuth);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.login(formData);

      if (result.success) {
        initAuth();
        navigate({ to: "/" });
      } else {
        setError(result.message || "Erreur de connexion");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    loading,
    handleSubmit,
  };
};
