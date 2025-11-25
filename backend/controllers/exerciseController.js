import Exercise from "../models/Exercise.js";
import User from "../models/User.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Créer un exercice
export const createExercise = async (req, res) => {
  try {
    const { name, description, category, subcategory } = req.body;

    // Vérifications
    if (!name || !description || !category || !subcategory) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs requis",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Veuillez télécharger une image",
      });
    }

    // Créer l'exercice avec Sequelize
    const exercise = await Exercise.create({
      name,
      description,
      category,
      subcategory,
      image: `/uploads/exercises/${req.file.filename}`,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: "Exercice créé avec succès",
      data: exercise,
    });
  } catch (error) {
    console.error("Erreur création exercice:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les exercices
export const getAllExercises = async (req, res) => {
  try {
    const { category } = req.query;

    const whereClause = category ? { category } : {};

    const exercises = await Exercise.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    console.error("Erreur récupération exercices:", error);
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

    const exercises = await Exercise.findAll({
      where: { category },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      category,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    console.error("Erreur récupération par catégorie:", error);
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

    const exercises = await Exercise.findAll({
      where: {
        category,
        subcategory,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      category,
      subcategory,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    console.error("Erreur récupération par sous-catégorie:", error);
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

    const exercise = await Exercise.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercice non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("Erreur récupération exercice:", error);
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
    const { name, description, category, subcategory } = req.body;

    let exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercice non trouvé",
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

    // Mettre à jour les champs avec Sequelize
    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      category: category || exercise.category,
      subcategory: subcategory || exercise.subcategory,
      image: exercise.image,
    });

    res.status(200).json({
      success: true,
      message: "Exercice mis à jour avec succès",
      data: exercise,
    });
  } catch (error) {
    console.error("Erreur mise à jour exercice:", error);
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

    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercice non trouvé",
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

    await exercise.destroy();

    res.status(200).json({
      success: true,
      message: "Exercice supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression exercice:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
