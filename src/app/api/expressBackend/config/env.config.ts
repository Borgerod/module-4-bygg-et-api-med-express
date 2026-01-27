import dotenv from "dotenv";
dotenv.config();

// import type { Dialect } from "sequelize";

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 4000,

  database: {
    // host: process.env.DB_HOST ?? "localhost",
    // port: Number(process.env.DB_PORT) || 5432,
    // name: process.env.DB_NAME ?? "node_express_db",
    // user: process.env.DB_USER ?? "postgres",
    // password: process.env.DB_PASSWORD ?? "",
    // dialect: (process.env.DB_DIALECT as Dialect) || "postgres",
    storage: process.env.DB_STORAGE ?? "",
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? "foobar12",
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION ?? "3h",
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? "7d",
  },

  cors: {
    origins: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:4000", "http://127.0.0.1:5500"],
  },
};
