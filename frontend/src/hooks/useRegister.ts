import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Hook de gestion du formulaire d'inscription
 * Gère la validation, soumission et redirection après inscription
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const initAuth = useAuthStore((state) => state.initAuth);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      });

      if (result.success) {
        initAuth();
        navigate({ to: "/" });
      } else {
        setError(result.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err);
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
