import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Construction de l'URI de connexion pour forcer IPv4
const databaseUrl = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "production" ? false : console.log,
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    connectTimeout: 30000,
    statement_timeout: 30000,
  },
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 1000,
  },
  retry: {
    max: 3,
    match: [
      /ETIMEDOUT/,
      /ECONNREFUSED/,
      /ECONNRESET/,
      /EPIPE/,
      /ENETUNREACH/,
      /PROTOCOL_CONNECTION_LOST/,
      /SequelizeConnectionError/,
    ],
  },
});

export const connectDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

  // Log des credentials pour debug (masquer le password)
  console.log("🔍 DB Config:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? "***SET***" : "❌ MISSING",
    nodeEnv: process.env.NODE_ENV,
  });

  while (attempt < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log("✅ PostgreSQL DB Connected (FlowFit)");

      // Import models to ensure they're registered
      await import("../models/index.js");

      // Sync models (create tables if they don't exist)
      await sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
      console.log("✅ Database synchronized");
      return;
    } catch (error) {
      attempt++;
      console.error(
        `❌ DB connection attempt ${attempt}/${maxRetries} failed:`,
        error.message
      );
      console.error("📋 Error details:", {
        name: error.name,
        code: error.parent?.code,
        errno: error.parent?.errno,
      });

      if (attempt >= maxRetries) {
        console.error(
          "❌ Unable to connect to the database after",
          maxRetries,
          "attempts"
        );
        process.exit(1);
      }

      // Attendre avant de réessayer (backoff exponentiel)
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default sequelize;
