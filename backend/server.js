import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import exerciseRoutes from "./routes/exercises.js";
import sessionRoutes from "./routes/sessions.js";
import authRoutes from "./routes/auth.js";
import { requestTimeout, errorHandler } from "./middleware/timeout.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// Timeout middleware (25s pour éviter les timeouts Render à 30s)
app.use(requestTimeout(25000));

// Note: Les fichiers sont maintenant stockés sur Supabase Storage
// app.use("/uploads", express.static("uploads")); // Plus nécessaire

// db connection
connectDB();

// api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Middleware de gestion d'erreurs (doit être après les routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
