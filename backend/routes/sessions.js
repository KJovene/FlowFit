import express from "express";
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  rateSession,
  getUserRating,
  shareSession,
  toggleSessionSharing,
  getUserSessions,
} from "../controllers/sessionController.js";
import { upload } from "../config/multer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Routes - toutes protégées par l'authentification
router.post("/", protect, upload.single("image"), createSession);
router.get("/", protect, getAllSessions);
router.get("/my-sessions", protect, getUserSessions);
router.get("/:id", protect, getSessionById);
router.get("/:id/user-rating", protect, getUserRating);
router.put("/:id", protect, upload.single("image"), updateSession);
router.delete("/:id", protect, deleteSession);
router.post("/:id/rate", protect, rateSession);
router.post("/:id/share", protect, shareSession);
router.post("/:id/toggle-share", protect, toggleSessionSharing);

export default router;
