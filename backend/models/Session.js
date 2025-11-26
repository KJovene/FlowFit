import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Session = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Musculation", "Yoga", "Mobilité", "Mixte"),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // durée totale estimée en minutes
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM("Facile", "Moyen", "Difficile"),
      allowNull: false,
      defaultValue: "Facile",
    },
    restTime: {
      type: DataTypes.INTEGER, // temps de repos entre chaque exercice en secondes (5, 10, 15, 20)
      allowNull: false,
      defaultValue: 10,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // optionnel, peut utiliser l'image du premier exercice
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isShared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Session;
