import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SessionExercise = sequelize.define(
  "SessionExercise",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Sessions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    exerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Exercises",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    order: {
      type: DataTypes.INTEGER, // ordre dans la séance
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // durée de l'exercice en secondes
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default SessionExercise;
