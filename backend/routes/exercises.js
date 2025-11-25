import express from "express";
import {
  createExercise,
  getAllExercises,
  getExercisesByCategory,
  getExercisesBySubcategory,
  getExerciseById,
  updateExercise,
  deleteExercise,
} from "../controllers/exerciseController.js";
import { upload } from "../config/multer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Routes - toutes protégées par l'authentification
router.post("/", protect, upload.single("image"), createExercise);
router.get("/", protect, getAllExercises);
router.get("/category/:category", protect, getExercisesByCategory);
router.get(
  "/category/:category/:subcategory",
  protect,
  getExercisesBySubcategory
);
router.get("/:id", protect, getExerciseById);
router.put("/:id", protect, upload.single("image"), updateExercise);
router.delete("/:id", protect, deleteExercise);

export default router;
