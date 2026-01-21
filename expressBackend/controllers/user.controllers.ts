import {
  UserCreation,
  UserSchemaCreate,
  UserSchemaUpdate,
  UserUpdate,
} from "@expressBackend/schema/user.schema";
import User, { UserAttributes } from "../models/user.model";
import bcrypt from "bcrypt";

type UserSafe = Omit<UserAttributes, "passwordHash">;

export async function getUsers(): Promise<UserSafe[]> {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    return users.map((user) => user.toJSON() as UserSafe);
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Failed to fetch users");
  }
}

export async function getUserById(id: string): Promise<UserSafe> {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) throw new Error("User not found");
    return user.toJSON() as UserSafe;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw new Error("Failed to fetch user");
  }
}

export async function createUser(createUserData: UserCreation) {
  const validatedData = UserSchemaCreate.parse(createUserData);
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  // Remove password before passing to User.create
  // const { password, ...rest } = validatedData;
  const { ...rest } = validatedData;

  const user = await User.create({
    ...rest,
    password: hashedPassword,
  });

  return user.toJSON() as UserSafe;
}

export async function updateUser(
  id: string,
  updateData: UserUpdate,
  // updateData: Omit<UserType, "passwordHash"> & { password: string },
) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    const validatedData = UserSchemaUpdate.parse(updateData);
    await user.update(validatedData);

    // await user.update(updateData);

    return user.toJSON();
  } catch (err) {
    console.error("Error while updating user:", err);
    throw new Error("Failed to update user");
  }
}
