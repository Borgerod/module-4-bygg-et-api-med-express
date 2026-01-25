import sequelize from "@expressBackend/config/db.config";
import User from "./user.model";
import Employee from "./employee.model";

// Define associations
User.hasOne(Employee, {
  foreignKey: "user_id",
  as: "employee_profile",
});

Employee.belongsTo(User, {
  foreignKey: "user_id",
  as: "user_account",
});

// Export models and sequelize instance
export { sequelize, User, Employee };

const db = {
  sequelize,
  User,
  Employee,
};

export default db;
