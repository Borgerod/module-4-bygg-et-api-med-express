import { Sequelize } from "sequelize";
import { config } from "./env.config";

const { database } = config;

// Initialize Sequelize instance
const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: database.dialect,
    storage: database.storage, // Only for SQLite

    // Logging
    logging: config.env === "development" ? console.log : false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+00:00",
    define: {
      timestamps: true, // Adds createdAt and updatedAt
      underscored: true, // Use snake_case for column names
      freezeTableName: false, // Pluralize table names
    },
  },
);

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to connect to database:", error.message);
    } else {
      console.error("Failed to connect to database:", error);
    }
    return false;
  }
};

// !! *could* be UNSAFE for production
export const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log("All models synced!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to sync models:", error.message);
    } else {
      console.error("Failed to sync models:", error);
    }
    throw error;
  }
};

export { sequelize };
export default sequelize;
