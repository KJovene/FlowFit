import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "FlowFit",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
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
        /PROTOCOL_CONNECTION_LOST/,
        /SequelizeConnectionError/,
      ],
    },
  }
);

export const connectDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

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
