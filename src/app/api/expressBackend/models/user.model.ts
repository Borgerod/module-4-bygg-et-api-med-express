import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "@/app/api/expressBackend/config/db.config";

interface UserAttributes {
  id: string;
  userAccount: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
  // isOnline: boolean;
}

class User
  extends Model<
    UserAttributes,
    Omit<UserAttributes, "id" | "createdAt" | "updatedAt" | "userAccount">
  >
  implements UserAttributes
{
  declare id: string;
  declare userAccount: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: "user" | "admin";
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare isActive: boolean;
  // declare isOnline: boolean;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON(): Omit<UserAttributes, "password"> {
    const values = { ...this.get() } as UserAttributes;
    // @ts-expect-error password is present on instance but should not be exposed in API responses
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,

      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      field: "id",
    },
    userAccount: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      field: "user_account",
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "username",
      validate: {
        notEmpty: { msg: "Username cannot be empty" },
        len: { args: [3, 30], msg: "Username must be 3-30 characters" },
        is: {
          args: /^[a-zA-Z0-9_]+$/,
          msg: "Username can only contain letters, numbers, and underscores",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "email",
      validate: {
        isEmail: { msg: "Must be a valid email address" },
        notEmpty: { msg: "Email cannot be empty" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
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
      field: "role",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    // isOnline: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    //   field: "is_online",
    // },
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
  },
  {
    sequelize,
    tableName: "Users",
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
