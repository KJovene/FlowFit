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
  addToFavorites,
  removeFromFavorites,
  getFavoriteSessions,
  checkIfFavorite,
} from "../controllers/sessionController.js";
import { upload, uploadToSupabaseMiddleware } from "../config/multer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const BUCKET_SESSIONS = process.env.STORAGE_BUCKET_SESSIONS || "sessions";

// Routes - toutes protégées par l'authentification
router.post(
  "/",
  protect,
  upload.single("image"),
  uploadToSupabaseMiddleware(BUCKET_SESSIONS),
  createSession
);
router.get("/", protect, getAllSessions);
router.get("/my-sessions", protect, getUserSessions);
router.get("/favorites", protect, getFavoriteSessions);
router.get("/:id", protect, getSessionById);
router.get("/:id/user-rating", protect, getUserRating);
router.get("/:id/is-favorite", protect, checkIfFavorite);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  uploadToSupabaseMiddleware(BUCKET_SESSIONS),
  updateSession
);
router.delete("/:id", protect, deleteSession);
router.post("/:id/rate", protect, rateSession);
router.post("/:id/share", protect, shareSession);
router.post("/:id/toggle-share", protect, toggleSessionSharing);
router.post("/:id/favorite", protect, addToFavorites);
router.delete("/:id/favorite", protect, removeFromFavorites);

export default router;
