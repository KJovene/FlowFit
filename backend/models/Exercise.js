import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Exercise = sequelize.define(
  "Exercise",
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
      type: DataTypes.ENUM("Musculation", "Yoga", "Mobilité"),
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.ENUM("Dos", "Haut du corps", "Bassin", "Bas de corps"),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Exercise;
