import multer from "multer";
import { uploadToSupabase } from "./supabase.js";

// Configuration du stockage en mémoire pour Supabase
const storage = multer.memoryStorage();

// Filtre les fichiers
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * Middleware to upload file to Supabase after multer processing
 * @param {string} bucketName - The Supabase storage bucket name
 */
export const uploadToSupabaseMiddleware = (bucketName) => {
  return async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    try {
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
        req.file.originalname
      }`;

      const result = await uploadToSupabase(
        req.file.buffer,
        fileName,
        bucketName,
        req.file.mimetype
      );

      // Attach Supabase URL to request for use in controllers
      req.file.supabaseUrl = result.url;
      req.file.supabasePath = result.path;

      next();
    } catch (error) {
      console.error("Error uploading to Supabase:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  };
};
