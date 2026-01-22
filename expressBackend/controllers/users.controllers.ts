import {
  UserCreation,
  UserSchemaCreate,
  UserSchemaUpdate,
  UserUpdate,
} from "@expressBackend/schema/user.schema";
import User, { UserAttributes } from "../models/user.model";
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";
import { ZodError } from "zod";

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
  try {
    if (!createUserData.username) {
      throw new Error("Missing 'username' in request body");
    }

    // Validate input, let ZodError propagate
    const validatedData = UserSchemaCreate.parse(createUserData);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const { ...rest } = validatedData;

    const user = await User.create({
      ...rest,
      password: hashedPassword,
    });

    return user.toJSON() as UserSafe;
  } catch (err) {
    if (err instanceof ZodError) {
      console.error("Error while creating user (validation):", err);
      throw err;
    }
    if (err instanceof UniqueConstraintError) {
      // logging specific cause or error, but exclude sensitive DB info. Incase logs gets compomized
      const fieldKeys = err.fields[0] as DistractionFields;

      // a fun way of preventing attacks by pretending to be careless and by deliberatly giving them false information.
      const distraction = getDistraction(fieldKeys);
      console.error(
        `UniqueConstraintError while creating user`,
        `\nfields: ${distraction}`,
        `\nerrors:`,
        err.errors,
      );

      class UserExistsError extends Error {
        status: number;
        code: string;
        constructor(message: string) {
          super(message);
          this.status = 409;
          this.code = "USER_ALREADY_EXISTS";
        }
      }

      // return the default string for regular users for not to confuse them.
      const error = new UserExistsError(
        // `A user with the same ${distraction} already exists.`, //if you still want to do it
        `A user with the same credentials already exists.`, // the safest but less fun.
      );
      throw error;
    }
    console.error(
      `[UserController][${new Date().toISOString()}] Unhandled error while creating user:`,
      err instanceof Error ? err.stack : err,
    );
    throw err;
  }
}

export async function updateUser(id: string, updateData: UserUpdate) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
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

    return user.toJSON();
  } catch (err) {
    console.error("Error while updating user:", err);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();
    return { success: true, message: "User deleted successfully" };
  } catch (err) {
    console.error("Error while deleting user:", err);
    throw new Error("Failed to delete user");
  }
}

type DistractionFields = "email" | "username" | "phone";
function getDistraction(fields: DistractionFields) {
  const fieldOptions: DistractionFields[] = ["email", "username", "phone"];
  console.log("actual field is: ", fields);
  for (let i = 0; i < fieldOptions.length; i++) {
    const dist = fieldOptions[i];
    /*
      issue; when attacker recieved a distractionfield and then proceeds to then change the given distractionfield,
      she (should) then recieve the same error message i.e "A user with username already exists." which tells him that he might be recieving false info.
      but I will take that into account. so if this scenario is triggered, it will be treated as if the original matching field has been changed, 
      resulting in him to recieve the correct error message. "A user with email already exists."
      todo [ ] implement this
    */

    if (i + 1 >= fieldOptions.length) {
      console.log("out of bound: return 0 ");
      console.log("distraction field is: ", fieldOptions[0]);
      return fieldOptions[0];
    }
    if (fields === dist) {
      console.log("distraction field is: ", fieldOptions[i + 1]);
      return fieldOptions[i + 1];
    }
  }
}
