import sequelize from "../config/db.config";
import User from "./user.model";
import Employee from "./employee.model";

// Define associations
User.hasOne(Employee, {
  foreignKey: "userId",
  as: "employeeProfile",
});

Employee.belongsTo(User, {
  foreignKey: "userId",
  as: "userAccount",
});

// Export models and sequelize instance
export { sequelize, User, Employee };

export default {
  sequelize,
  User,
  Employee,
};
