import Session from "../models/Session.js";
import SessionExercise from "../models/SessionExercise.js";
import Exercise from "../models/Exercise.js";
import User from "../models/User.js";
import SessionRating from "../models/SessionRating.js";
import FavoriteSession from "../models/FavoriteSession.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Créer une séance
export const createSession = async (req, res) => {
  try {
    const { name, description, category, difficulty, restTime, exercises } =
      req.body;

    console.log("📨 Requête création séance reçue");
    console.log("📦 Body:", {
      name,
      category,
      difficulty,
      restTime,
      exercisesCount: exercises?.length,
    });

    // Vérifications
    if (!name || !description || !category || !difficulty || !restTime) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs requis",
      });
    }

    if (!exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Veuillez ajouter au moins un exercice",
      });
    }

    // Calculer la durée totale automatiquement (durée des exercices + temps de repos)
    const totalDuration =
      exercises.reduce((total, ex) => {
        return total + parseInt(ex.duration);
      }, 0) +
      (exercises.length - 1) * parseInt(restTime);

    // Créer la séance
    const session = await Session.create({
      name,
      description,
      category,
      duration: totalDuration,
      difficulty,
      restTime: parseInt(restTime),
      image: req.file ? `/uploads/sessions/${req.file.filename}` : null,
      createdBy: req.user?.id || null,
    });

    // Ajouter les exercices à la séance
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      await SessionExercise.create({
        sessionId: session.id,
        exerciseId: ex.exerciseId,
        order: ex.order || i + 1,
        duration: parseInt(ex.duration),
      });
    }

    console.log("✅ Séance créée:", session.id);

    res.status(201).json({
      success: true,
      message: "Séance créée avec succès",
      data: session,
    });
  } catch (error) {
    console.error("💥 Erreur création séance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer toutes les séances communautaires (partagées)
export const getAllSessions = async (req, res) => {
  try {
    const { category } = req.query;

    const whereClause = { isShared: true };
    if (category && category !== "all") {
      whereClause.category = category;
    }

    const sessions = await Session.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Exercise,
          as: "exercises",
          through: {
            attributes: ["order", "duration"],
          },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    // Formater les données pour le frontend
    const formattedSessions = sessions.map((session) => {
      const sessionData = session.toJSON();
      return {
        ...sessionData,
        createdBy: sessionData.creator?.username || "Inconnu",
        exercises: sessionData.exercises
          ? sessionData.exercises.map((exercise) => ({
              exercise: {
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                category: exercise.category,
                subcategory: exercise.subcategory,
                image: exercise.image,
              },
              order: exercise.SessionExercise.order,
              duration: exercise.SessionExercise.duration,
            }))
          : [],
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSessions.length,
      data: formattedSessions,
    });
  } catch (error) {
    console.error("💥 Erreur récupération séances:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer une séance par ID avec détails
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByPk(id, {
      include: [
        {
          model: Exercise,
          as: "exercises",
          through: {
            attributes: ["order", "duration"],
          },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Séance non trouvée",
      });
    }

    // Formater les données pour le frontend
    const sessionData = session.toJSON();
    const formattedSession = {
      ...sessionData,
      createdBy: sessionData.creator?.username || "Inconnu",
      exercises: sessionData.exercises
        ? sessionData.exercises
            .map((exercise) => ({
              exercise: {
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                category: exercise.category,
                subcategory: exercise.subcategory,
                image: exercise.image,
              },
              order: exercise.SessionExercise.order,
              duration: exercise.SessionExercise.duration,
            }))
            .sort((a, b) => a.order - b.order)
        : [],
    };

    res.status(200).json({
      success: true,
      data: formattedSession,
    });
  } catch (error) {
    console.error("💥 Erreur récupération séance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mettre à jour une séance
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, difficulty, restTime, exercises } =
      req.body;

    let session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Séance non trouvée",
      });
    }

    // Mettre à jour l'image si nouvelle
    if (req.file) {
      if (session.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          session.image.replace(/^\//, "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      session.image = `/uploads/sessions/${req.file.filename}`;
    }

    // Calculer la nouvelle durée si exercices fournis
    let totalDuration = session.duration;
    const sessionRestTime = restTime ? parseInt(restTime) : session.restTime;
    if (exercises && exercises.length > 0) {
      totalDuration =
        exercises.reduce((total, ex) => {
          return total + parseInt(ex.duration);
        }, 0) +
        (exercises.length - 1) * sessionRestTime;
    }

    // Mettre à jour les champs
    await session.update({
      name: name || session.name,
      description: description || session.description,
      category: category || session.category,
      duration: totalDuration,
      difficulty: difficulty || session.difficulty,
      restTime: sessionRestTime,
      image: session.image,
    });

    // Mettre à jour les exercices si fournis
    if (exercises && exercises.length > 0) {
      // Supprimer les anciens exercices
      await SessionExercise.destroy({ where: { sessionId: id } });

      // Ajouter les nouveaux
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        await SessionExercise.create({
          sessionId: session.id,
          exerciseId: ex.exerciseId,
          order: ex.order || i + 1,
          duration: parseInt(ex.duration),
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Séance mise à jour avec succès",
      data: session,
    });
  } catch (error) {
    console.error("💥 Erreur mise à jour séance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Supprimer une séance
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Séance non trouvée",
      });
    }

    // Supprimer l'image si elle existe
    if (session.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        session.image.replace(/^\//, "")
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await session.destroy();

    res.status(200).json({
      success: true,
      message: "Séance supprimée avec succès",
    });
  } catch (error) {
    console.error("💥 Erreur suppression séance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Noter une séance
export const rateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "La note doit être comprise entre 1 et 5",
      });
    }

    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Séance non trouvée",
      });
    }

    // Vérifier si l'utilisateur a déjà noté cette séance
    let existingRating = await SessionRating.findOne({
      where: {
        userId,
        sessionId: id,
      },
    });

    if (existingRating) {
      // Mettre à jour la note existante
      await existingRating.update({ rating: parseInt(rating) });
    } else {
      // Créer une nouvelle note
      await SessionRating.create({
        userId,
        sessionId: id,
        rating: parseInt(rating),
      });
    }

    // Recalculer la moyenne en récupérant toutes les notes
    const allRatings = await SessionRating.findAll({
      where: { sessionId: id },
    });

    const totalRatings = allRatings.length;
    const sumRatings = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Mettre à jour la session avec la nouvelle moyenne
    await session.update({
      rating: averageRating,
      ratingCount: totalRatings,
    });

    res.status(200).json({
      success: true,
      message: existingRating
        ? "Note mise à jour avec succès"
        : "Note enregistrée avec succès",
      data: {
        rating: averageRating,
        ratingCount: totalRatings,
        userRating: parseInt(rating),
      },
    });
  } catch (error) {
    console.error("💥 Erreur notation séance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer la note de l'utilisateur pour une séance
export const getUserRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rating = await SessionRating.findOne({
      where: {
        userId,
        sessionId: id,
      },
    });

    res.status(200).json({
      success: true,
      data: rating ? { userRating: rating.rating } : { userRating: null },
    });
  } catch (error) {
    console.error("💥 Erreur récupération note utilisateur:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Partager une séance avec la communauté
export const shareSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Séance non trouvée",
      });
    }

    // Vérifier que l'utilisateur est le créateur
    if (session.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à partager cette séance",
      });
    }

    // Vérifier si déjà partagée
    if (session.isShared) {
      return res.status(400).json({
        success: false,
        message: "Cette séance est déjà partagée",
      });
    }

    await session.update({ isShared: true });

    res.status(200).json({
      success: true,
      message: "Séance partagée avec la communauté",
      data: session,
    });
  } catch (error) {
    console.error("💥 Erreur partage séance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle le partage d'une séance (communautaire ou privée)
export const toggleSessionSharing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Séance non trouvée",
      });
    }

    // Vérifier que l'utilisateur est le créateur
    if (session.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier cette séance",
      });
    }

    // Toggle isShared
    await session.update({ isShared: !session.isShared });

    res.status(200).json({
      success: true,
      message: session.isShared
        ? "Séance partagée avec la communauté"
        : "Séance retirée de la communauté",
      data: session,
    });
  } catch (error) {
    console.error("💥 Erreur toggle partage séance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les séances créées par l'utilisateur
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shared } = req.query; // "true", "false" ou undefined pour toutes

    const whereClause = { createdBy: userId };
    if (shared === "true") {
      whereClause.isShared = true;
    } else if (shared === "false") {
      whereClause.isShared = false;
    }

    const sessions = await Session.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Exercise,
          as: "exercises",
          through: {
            attributes: ["order", "duration"],
          },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    // Formater les données pour le frontend
    const formattedSessions = sessions.map((session) => {
      const sessionData = session.toJSON();
      return {
        ...sessionData,
        createdBy: sessionData.creator?.username || "Inconnu",
        exercises: sessionData.exercises
          ? sessionData.exercises.map((exercise) => ({
              exercise: {
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                category: exercise.category,
                subcategory: exercise.subcategory,
                image: exercise.image,
              },
              order: exercise.SessionExercise.order,
              duration: exercise.SessionExercise.duration,
            }))
          : [],
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSessions.length,
      data: formattedSessions,
    });
  } catch (error) {
    console.error("💥 Erreur récupération séances utilisateur:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Ajouter une séance aux favoris
export const addToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Séance non trouvée",
      });
    }

    // Vérifier si déjà dans les favoris
    const existingFavorite = await FavoriteSession.findOne({
      where: {
        userId,
        sessionId: id,
      },
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Cette séance est déjà dans vos favoris",
      });
    }

    await FavoriteSession.create({
      userId,
      sessionId: id,
    });

    res.status(200).json({
      success: true,
      message: "Séance ajoutée aux favoris",
    });
  } catch (error) {
    console.error("💥 Erreur ajout favori:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Retirer une séance des favoris
export const removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await FavoriteSession.findOne({
      where: {
        userId,
        sessionId: id,
      },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Cette séance n'est pas dans vos favoris",
      });
    }

    await favorite.destroy();

    res.status(200).json({
      success: true,
      message: "Séance retirée des favoris",
    });
  } catch (error) {
    console.error("💥 Erreur suppression favori:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les séances favorites de l'utilisateur
export const getFavoriteSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await FavoriteSession.findAll({
      where: { userId },
      include: [
        {
          model: Session,
          as: "session",
          include: [
            {
              model: Exercise,
              as: "exercises",
              through: {
                attributes: ["order", "duration"],
              },
            },
            {
              model: User,
              as: "creator",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Formater les données pour le frontend
    const formattedSessions = favorites
      .map((favorite) => {
        const session = favorite.session;
        if (!session) return null;

        const sessionData = session.toJSON();
        return {
          ...sessionData,
          createdBy: sessionData.creator?.username || "Inconnu",
          exercises: sessionData.exercises
            ? sessionData.exercises.map((exercise) => ({
                exercise: {
                  id: exercise.id,
                  name: exercise.name,
                  description: exercise.description,
                  category: exercise.category,
                  subcategory: exercise.subcategory,
                  image: exercise.image,
                },
                order: exercise.SessionExercise.order,
                duration: exercise.SessionExercise.duration,
              }))
            : [],
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: formattedSessions.length,
      data: formattedSessions,
    });
  } catch (error) {
    console.error("💥 Erreur récupération favoris:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Vérifier si une séance est dans les favoris
export const checkIfFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await FavoriteSession.findOne({
      where: {
        userId,
        sessionId: id,
      },
    });

    res.status(200).json({
      success: true,
      data: { isFavorite: !!favorite },
    });
  } catch (error) {
    console.error("💥 Erreur vérification favori:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
