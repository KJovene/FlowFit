import sequelize from "../config/db.js";
import { QueryTypes } from "sequelize";

async function addIsSharedColumn() {
  try {
    console.log("🔄 Ajout de la colonne isShared à la table Exercises...");

    // Vérifier si la colonne existe déjà (syntaxe PostgreSQL)
    const columns = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'Exercises' 
       AND column_name = 'isShared'`,
      { type: QueryTypes.SELECT }
    );

    if (columns.length > 0) {
      console.log("✅ La colonne isShared existe déjà");
      return;
    }

    // Ajouter la colonne isShared (syntaxe PostgreSQL)
    await sequelize.query(
      `ALTER TABLE "Exercises" ADD COLUMN "isShared" BOOLEAN NOT NULL DEFAULT false`,
      { type: QueryTypes.RAW }
    );

    console.log("✅ Colonne isShared ajoutée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la colonne:", error);
    throw error;
  }
}

// Exécuter la migration
addIsSharedColumn()
  .then(() => {
    console.log("✅ Migration terminée");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration échouée:", error);
    process.exit(1);
  });
