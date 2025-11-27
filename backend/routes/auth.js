import express from "express";
import {
  register,
  login,
  getMe,
  uploadProfileImage,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for profile images
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error("Seules les images sont acceptées (jpeg, jpg, png, gif, webp)")
    );
  },
});

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post(
  "/profile-image",
  protect,
  uploadProfile.single("profileImage"),
  uploadProfileImage
);

export default router;
