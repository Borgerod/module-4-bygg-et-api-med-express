import { Sequelize } from "sequelize";
import { config } from "./env.config";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.database.storage || "./dev.db",
  logging: config.env === "development" ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  },
});

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
};

export const syncDatabase = async (options = {}): Promise<void> => {
  try {
    await sequelize.sync(options);
    console.log("All models synced!");
  } catch (error) {
    console.error("Failed to sync models:", error);
    throw error;
  }
};

export default sequelize;
export { sequelize };
