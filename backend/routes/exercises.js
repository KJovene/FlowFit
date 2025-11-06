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

const router = express.Router();

// Routes
router.post("/", upload.single("image"), createExercise);
router.get("/", getAllExercises);
router.get("/category/:category", getExercisesByCategory);
router.get("/category/:category/:subcategory", getExercisesBySubcategory);
router.get("/:id", getExerciseById);
router.put("/:id", upload.single("image"), updateExercise);
router.delete("/:id", deleteExercise);

export default router;
