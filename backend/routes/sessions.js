import express from "express";
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";
import { upload } from "../config/multer.js";

const router = express.Router();

// Routes
router.post("/", upload.single("image"), createSession);
router.get("/", getAllSessions);
router.get("/:id", getSessionById);
router.put("/:id", upload.single("image"), updateSession);
router.delete("/:id", deleteSession);

export default router;
