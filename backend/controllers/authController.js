import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log("📨 Requête register reçue");
    console.log("📦 Body:", {
      ...req.body,
      password: "***",
      passwordConfirm: "***",
    });

    const { username, email, password, passwordConfirm } = req.body;

    // Validation
    if (!username || !email || !password || !passwordConfirm) {
      console.log("❌ Validation échouée: champs manquants");
      return res
        .status(400)
        .json({ success: false, message: "Veuillez remplir tous les champs" });
    }

    if (password !== passwordConfirm) {
      console.log("❌ Validation échouée: mots de passe différents");
      return res.status(400).json({
        success: false,
        message: "Les mots de passe ne correspondent pas",
      });
    }

    // Check if user already exists (Sequelize syntax)
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (userExists) {
      console.log("❌ Utilisateur existe déjà:", userExists.email);
      return res.status(400).json({
        success: false,
        message: "Cet email ou nom d'utilisateur est déjà utilisé",
      });
    }

    console.log("✅ Création de l'utilisateur...");
    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    console.log("✅ Utilisateur créé:", user.id);

    // Generate token (use user.id instead of user._id)
    const token = generateToken(user.id);

    console.log("✅ Token généré, envoi de la réponse");
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("💥 Erreur register:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log("📨 Requête login reçue");
    console.log("📦 Body:", { ...req.body, password: "***" });

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("❌ Validation échouée: champs manquants");
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un email et un mot de passe",
      });
    }

    console.log("🔍 Recherche de l'utilisateur:", email);
    // Find user (Sequelize syntax - password is already included)
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("❌ Utilisateur non trouvé:", email);
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    console.log("✅ Utilisateur trouvé:", user.id, user.email);
    console.log("🔐 Vérification du mot de passe...");

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    console.log("🔐 Résultat matchPassword:", isMatch);

    if (!isMatch) {
      console.log("❌ Mot de passe incorrect");
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    console.log("✅ Mot de passe correct, génération du token...");
    // Generate token (use user.id instead of user._id)
    const token = generateToken(user.id);

    console.log("✅ Token généré, envoi de la réponse");
    res.status(200).json({
      success: true,
      message: "Connecté avec succès",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("💥 Erreur login:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // Sequelize syntax: findByPk instead of findById
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/auth/profile-image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucune image fournie",
      });
    }

    // Use Supabase URL from middleware
    const profileImageUrl = req.file.supabaseUrl;

    // Update user profile image
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    user.profileImage = profileImageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Photo de profil mise à jour",
      profileImage: profileImageUrl,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
