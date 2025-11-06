import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide an exercise name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  category: {
    type: String,
    enum: ["Musculation", "Yoga", "Mobilité"],
    required: [true, "Please select a category"],
  },
  subcategory: {
    type: String,
    enum: ["Dos", "Haut du corps", "Bassin", "Bas de corps"],
    required: [true, "Please select a subcategory"],
  },
  type: {
    type: String,
    enum: ["Quantité", "Temps"],
    required: [true, "Choisissez le type de votre exercice"],
  },
  image: {
    type: String,
    required: [true, "Please upload an image"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Exercise = mongoose.model("Exercise", exerciseSchema);
