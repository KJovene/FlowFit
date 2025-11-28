/**
 * Migration pour rendre les descriptions optionnelles
 * Modifie les colonnes 'description' des tables Exercises et Sessions
 * pour accepter les valeurs NULL
 */

import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface) => {
  // Modifier la colonne description de la table Exercises pour accepter NULL
  await queryInterface.changeColumn("Exercises", "description", {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  // Modifier la colonne description de la table Sessions pour accepter NULL
  await queryInterface.changeColumn("Sessions", "description", {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  console.log("✅ Migration: descriptions rendues optionnelles");
};

export const down = async (queryInterface) => {
  // Remettre les descriptions comme obligatoires
  await queryInterface.changeColumn("Exercises", "description", {
    type: DataTypes.TEXT,
    allowNull: false,
  });

  await queryInterface.changeColumn("Sessions", "description", {
    type: DataTypes.TEXT,
    allowNull: false,
  });

  console.log("⬇️ Migration: descriptions rendues obligatoires à nouveau");
};
