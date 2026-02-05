import sequelize from "@/app/api/expressBackend/config/db.config";
import User from "./user.model";
import Employee from "./employee.model";
import RefreshToken from "./refresh-token.model";

// Define associations
User.hasOne(Employee, {
  foreignKey: "user_id",
  as: "employee_profile",
});

Employee.belongsTo(User, {
  foreignKey: "user_id",
  as: "user_account",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  constraints: true,
});

// Export models and sequelize instance
export { sequelize, User, Employee, RefreshToken };

const db = {
  sequelize,
  User,
  Employee,
  RefreshToken,
};

export default db;
