import express from "express";
import {
  createExercise,
  getAllExercises,
  getExercisesByCategory,
  getExercisesBySubcategory,
  getExerciseById,
  updateExercise,
  deleteExercise,
  toggleExerciseSharing,
  getCommunityExercises,
  getMyExercises,
} from "../controllers/exerciseController.js";
import { upload, uploadToSupabaseMiddleware } from "../config/multer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const BUCKET_EXERCISES = process.env.STORAGE_BUCKET_EXERCISES || "exercises";

// Routes - toutes protégées par l'authentification
router.post(
  "/",
  protect,
  upload.single("image"),
  uploadToSupabaseMiddleware(BUCKET_EXERCISES),
  createExercise
);
router.get("/", protect, getAllExercises);
router.get("/community", protect, getCommunityExercises);
router.get("/my-exercises", protect, getMyExercises);
router.get("/category/:category", protect, getExercisesByCategory);
router.get(
  "/category/:category/:subcategory",
  protect,
  getExercisesBySubcategory
);
router.get("/:id", protect, getExerciseById);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  uploadToSupabaseMiddleware(BUCKET_EXERCISES),
  updateExercise
);
router.delete("/:id", protect, deleteExercise);
router.post("/:id/toggle-share", protect, toggleExerciseSharing);

export default router;
