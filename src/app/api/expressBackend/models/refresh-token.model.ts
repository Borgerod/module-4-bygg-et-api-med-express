import { DataTypes } from "sequelize";
import sequelize from "@/app/api/expressBackend/config/db.config.js";

/* * RefreshToken w/ unique ID's * */
const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: "token",
    },
    loginAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "login_at",
    },
    logoutAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "logout_at",
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "session_id",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
    rememberMe: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "remember_me",
    },
  },
  {
    tableName: "activeRefreshTokens",
    timestamps: true,
  },
);

export default RefreshToken;
