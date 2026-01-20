import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name cannot be empty",
        },
        len: {
          args: [2, 50],
          msg: "First name must be between 2 and 50 characters",
        },
      },
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last name cannot be empty",
        },
        len: {
          args: [2, 50],
          msg: "Last name must be between 2 and 50 characters",
        },
      },
    },

    // Optional: Add more fields as needed
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Optional: Link employee to user account
    // userId: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   references: {
    //     model: "users",
    //     key: "id"
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "SET NULL"
    // }
  },
  {
    tableName: "employees",
    timestamps: true,

    // Indexes for performance
    indexes: [
      {
        fields: ["lastname", "firstname"],
      },
      // {
      //   fields: ["userId"]
      // }
    ],
  },
);

export default Employee;
