import {
  UserCreation,
  UserSchemaCreate,
  UserSchemaUpdate,
  UserUpdate,
} from "@expressBackend/schema/user.schema";
import User, { UserAttributes } from "../models/user.model";
import bcrypt from "bcrypt";
import {
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from "sequelize";
import { ZodError } from "zod";

type UserSafe = Omit<UserAttributes, "passwordHash">;

function getStatusFromError(error: unknown): number {
  if (error instanceof ZodError) return 400;
  if (typeof error === "object" && error !== null) {
    const clientError = error as { message?: string };
    const msg = clientError.message?.toLowerCase() ?? "";
    if (msg.includes("not found")) return 404;
    if (msg.includes("conflict")) return 409;
    if (msg.includes("unique constraint")) return 409;
    if (msg.includes("validation error")) return 400; // <-- add this line
  }
  return 500;
}

export async function getUsers(): Promise<UserSafe[]> {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    console.info(
      `GET /users`,
      users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
      })),
    );
    return users.map((user) => user.toJSON() as UserSafe);
  } catch (error) {
    console.error(`GET /users`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to fetch users");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}

export async function getUserById(id: string): Promise<UserSafe> {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      const clientError = new Error("User not found");
      (clientError as Error & { status: number }).status = 404;
      console.error(`GET /users/${id}`, { error: "User not found" });
      throw clientError;
    }
    console.info(`GET /users/${id}`, {
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return user.toJSON() as UserSafe;
  } catch (error) {
    console.error(`GET /users/${id}`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to fetch user");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}

export async function createUser(createUserData: UserCreation) {
  try {
    const validatedData = UserSchemaCreate.parse(createUserData);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const { ...rest } = validatedData;

    const user = await User.create({
      ...rest,
      password: hashedPassword,
    });

    console.info(`POST /users`, {
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return user.toJSON() as UserSafe;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(`POST /users`, { error: error.issues });
      (error as ZodError & { status?: number }).status = 400;
      throw error;
    }
    if (error instanceof UniqueConstraintError) {
      console.error(`POST /users`, {
        error: "A user with the same credentials already exists.",
      });
      const clientError = new Error(
        "A user with the same credentials already exists.",
      ) as Error & { status?: number };
      clientError.status = 409;
      throw clientError;
    }
    console.error(`POST /users`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to create user") as Error & {
      status?: number;
    };
    clientError.status = getStatusFromError(error);
    throw clientError;
  }
}

export async function updateUser(id: string, updateData: UserUpdate) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      const clientError = new Error("User not found");
      (clientError as Error & { status: number }).status = 404;
      console.error(`PATCH /users/${id}`, { error: "User not found" });
      throw clientError;
    }
    const validatedData = UserSchemaUpdate.parse(updateData);

    // Hash password if it's being updated
    if (validatedData.password) {
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const { ...rest } = validatedData;
      await user.update({
        ...rest,
        password: hashedPassword,
      });
    } else {
      await user.update(validatedData);
    }

    const result = user.toJSON() as UserSafe;
    console.info(`PATCH /users/${id}`, {
      id: result.id,
      username: result.username,
      email: result.email,
    });
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(`PATCH /users/${id}`, { error: error.issues });
      (error as ZodError & { status: number }).status = 400;
      throw error;
    }
    if (error instanceof SequelizeValidationError) {
      console.error(`PATCH /users/${id}`, { error: error.errors });
      const clientError = new Error("Validation error") as Error & {
        status: number;
      };
      clientError.status = 400;
      throw clientError;
    }
    console.error(`PATCH /users/${id}`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to update user");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}

export async function deleteUser(id: string): Promise<UserSafe | null> {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      const clientError = new Error("User not found");
      (clientError as Error & { status: number }).status = 404;
      console.error(`DELETE /users/${id}`, { error: "User not found" });
      throw clientError;
    }
    const userData = user.toJSON() as UserSafe;
    await user.destroy();
    console.info(`DELETE /users/${id}`, {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    });
    return userData;
  } catch (error) {
    console.error(`DELETE /users/${id}`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to delete user");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}
