import { DataTypes } from "sequelize";
import sequelize from "@/app/api/expressBackend/config/db.config.js";

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    userId: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      unique: true,
    },
  },
  {
    tableName: "activeRefreshTokens",
    timestamps: true,
  },
);

export default RefreshToken;
