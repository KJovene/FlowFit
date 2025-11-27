import { useState } from "react";
import { sessionService } from "@/services/sessions";

export const useSessionRating = (sessionId: string, onSuccess?: () => void) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const openModal = async () => {
    try {
      const userRating = await sessionService.getUserRating(sessionId);
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
    setSelectedRating(0);
  };

  const submitRating = async () => {
    if (selectedRating === 0) return;

    try {
      setSubmitting(true);
      await sessionService.rate(sessionId, selectedRating);
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
    selectedRating,
    submitting,
    setSelectedRating,
    openModal,
    closeModal,
    submitRating,
  };
};
