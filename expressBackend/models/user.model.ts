import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "@expressBackend/config/db.config";
// import { User as UserType } from "@expressBackend/schema/user.schema";
import { UserCreation } from "@expressBackend/schema/user.schema";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
        notEmpty: {
          msg: "Email cannot be empty",
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty",
        },
        len: {
          args: [6, 100],
          msg: "Password must be between 8 and 100 characters",
        },
      },
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,

    // Hooks for password hashing
    hooks: {
      beforeCreate: async (user: UserCreation) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password; // Never expose password in API responses
  return values;
};

export default User;
