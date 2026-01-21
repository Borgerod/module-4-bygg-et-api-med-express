import User, { UserAttributes } from "../models/user.model";

type UserSafe = Omit<UserAttributes, "password">;

export async function getUsers(): Promise<UserSafe[]> {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });
  return users.map((user) => user.toJSON() as UserSafe);
}

export async function getUserById(id: string): Promise<UserSafe> {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found");
  return user.toJSON() as UserSafe;
}
