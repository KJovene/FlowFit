import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import exerciseRoutes from "./routes/exercises.js";
import sessionRoutes from "./routes/sessions.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// db connection
connectDB();

// api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
