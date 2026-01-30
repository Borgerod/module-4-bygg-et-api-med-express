// import { DataTypes } from "sequelize";
// import sequelize from "@/app/api/expressBackend/config/db.config";
// import User from "./user.model";
// import RefreshToken from "./refresh-token.model";
// //! this is more for being logged in with multiple devices.

// const UserRefreshToken = sequelize.define(
//   "UserRefreshToken",
//   {
//     userId: {
//       type: DataTypes.UUIDV4,
//       references: {
//         model: User,
//         key: "id",
//       },
//     },
//     refreshTokenId: {
//       type: DataTypes.UUIDV4,
//       references: {
//         model: RefreshToken,
//         key: "id",
//       },
//     },
//   },
//   {
//     tableName: "activeRefreshTokens",
//     timestamps: true,
//   },
// );

// UserRefreshToken.belongsTo(User, {
//   foreignKey: "userId",
// });

// export default RefreshToken;
