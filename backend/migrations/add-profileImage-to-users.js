import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

async function addProfileImageToUsers() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log("🔧 Ajout de la colonne profileImage à la table Users...");

    // Vérifier si la colonne existe déjà
    const table = await queryInterface.describeTable("Users");
    if (table.profileImage) {
      console.log("✅ La colonne profileImage existe déjà");
      return;
    }

    // Ajouter la colonne
    await queryInterface.addColumn("Users", "profileImage", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    console.log("✅ Colonne profileImage ajoutée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la colonne:", error);
    throw error;
  }
}

// Exécuter la migration
addProfileImageToUsers()
  .then(() => {
    console.log("✅ Migration terminée");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur migration:", error);
    process.exit(1);
  });
