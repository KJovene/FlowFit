import { Exercise } from "../models/Exercise.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Créer un exercice
export const createExercise = async (req, res) => {
  try {
    const { name, description, category, subcategory, type } = req.body;

    // Vérifications
    if (!name || !description || !category || !subcategory || !type) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Créer l'exercice
    const exercise = new Exercise({
      name,
      description,
      category,
      subcategory,
      type,
      image: `/uploads/exercises/${req.file.filename}`,
    });

    await exercise.save();

    res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les exercices
export const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les exercices par catégorie
export const getExercisesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const exercises = await Exercise.find({ category }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les exercices par catégorie et sous-catégorie
export const getExercisesBySubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    const exercises = await Exercise.find({
      category,
      subcategory,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category,
      subcategory,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer un exercice par ID
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      success: true,
      exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mettre à jour un exercice
export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, subcategory, type } = req.body;

    let exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    // Mettre à jour l'image si une nouvelle est fournie
    if (req.file) {
      // Supprimer l'ancienne image
      const oldImagePath = path.join(
        __dirname,
        "..",
        exercise.image.replace(/^\//, "")
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      exercise.image = `/uploads/exercises/${req.file.filename}`;
    }

    // Mettre à jour les champs
    if (name) exercise.name = name;
    if (description) exercise.description = description;
    if (category) exercise.category = category;
    if (subcategory) exercise.subcategory = subcategory;
    if (type) exercise.type = type;

    await exercise.save();

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Supprimer un exercice
export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    // Supprimer l'image
    const imagePath = path.join(
      __dirname,
      "..",
      exercise.image.replace(/^\//, "")
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Exercise.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
