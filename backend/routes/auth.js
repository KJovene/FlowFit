import express from "express";
import {
  register,
  login,
  getMe,
  uploadProfileImage,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { upload, uploadToSupabaseMiddleware } from "../config/multer.js";

const router = express.Router();

const BUCKET_PROFILES = process.env.STORAGE_BUCKET_PROFILES || "profiles";

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadToSupabaseMiddleware(BUCKET_PROFILES),
  uploadProfileImage
);

export default router;
