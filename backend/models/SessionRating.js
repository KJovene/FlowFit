import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SessionRating = sequelize.define(
  "SessionRating",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Sessions",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "sessionId"],
      },
    ],
  }
);

export default SessionRating;
