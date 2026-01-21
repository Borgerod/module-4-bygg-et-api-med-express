import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db.config";

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

class User
  extends Model<
    UserAttributes,
    Optional<UserAttributes, "id" | "createdAt" | "updatedAt" | "role">
  >
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare password: string;
  declare role: "user" | "admin";
  declare createdAt: Date;
  declare updatedAt: Date;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON(): Omit<UserAttributes, "password"> {
    const values = { ...this.get() } as UserAttributes;
    const { password, ...userWithoutPassword } = values;
    return userWithoutPassword;
  }
}

User.init(
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
        isEmail: { msg: "Must be a valid email address" },
        notEmpty: { msg: "Email cannot be empty" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        len: {
          args: [6, 100],
          msg: "Password must be between 6 and 100 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "User",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

export default User;

export type { UserAttributes };
