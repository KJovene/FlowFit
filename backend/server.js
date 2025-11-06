import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import exerciseRoutes from "./routes/exercises.js";
import "dotenv/config";

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// db connection
connectDB();

// api endpoints
app.use("/api/exercises", exerciseRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
