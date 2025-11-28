import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// HARDCODED: Neon.tech URL pour bypasser les variables d'environnement
const databaseUrl = "postgresql://neondb_owner:npg_goYICv89HMue@ep-orange-math-ab7ifjke-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require";

console.log("🔗 Using HARDCODED Neon database");

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "production" ? false : console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Neon PostgreSQL Connected (FlowFit)");

    // Import models to ensure they're registered
    await import("../models/index.js");

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
    console.log("✅ Database synchronized");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

export default sequelize;
