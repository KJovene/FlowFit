import { useState } from "react";
import { sessionService, type Session } from "@/services/sessions";

/**
 * Hook de gestion de la notation de séances (version dynamique)
 * Permet de noter n'importe quelle séance passée en paramètre
 */
export const useDynamicSessionRating = (onSuccess?: () => void) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const openModal = async (session: Session) => {
    setSelectedSession(session);
    try {
      const userRating = await sessionService.getUserRating(session.id);
      setSelectedRating(userRating || 0);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur chargement note utilisateur:", err);
      setSelectedRating(0);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSession(null);
    setSelectedRating(0);
  };

  const submitRating = async () => {
    if (!selectedSession || selectedRating === 0) return;

    try {
      setSubmitting(true);
      await sessionService.rate(selectedSession.id, selectedRating);
      closeModal();
      onSuccess?.();
    } catch (err) {
      console.error("Erreur lors de la notation:", err);
      alert("Une erreur est survenue lors de la notation");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showModal,
    selectedSession,
    selectedRating,
    submitting,
    setSelectedRating,
    openModal,
    closeModal,
    submitRating,
  };
};
