import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import User from "@/app/api/expressBackend/models/user.model";
import { config } from "@/app/api/expressBackend/config/env.config";
import RefreshToken from "@/app/api/expressBackend/models/refresh-token.model";
import jwt, { SignOptions } from "jsonwebtoken";
import * as userController from "@/app/api/expressBackend/controllers/users.controllers";
import * as employeeController from "@/app/api/expressBackend/controllers/employees.controllers";
import Employee from "@/app/api/expressBackend/models/employee.model";

function generateTokenPair(user: User) {
  const accessToken: string = jwt.sign(
    {
      role: user.role,
      user: {
        id: user.id,
      },
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.accessExpiration,
    } as SignOptions,
  );

  const refreshToken: string = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiration,
  } as SignOptions);

  return { accessToken, refreshToken };
}

export interface LoginResult {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

async function login(email: string, password: string): Promise<LoginResult> {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const result: boolean = bcrypt.compareSync(password, user.password);
  if (!result) {
    throw new Error("Invalid email or password");
  }
  const tokens = generateTokenPair(user);
  const sessionId = uuidv4();
  try {
    await RefreshToken.create({
      userId: user.id,
      token: tokens.refreshToken,
      sessionId,
      loginAt: new Date(),
    });
    await employeeController.updateEmployeeOnlineStatus(user.id, {
      isOnline: true,
      lastLoggedIn: new Date(),
    });
    const employee = await Employee.findOne({ where: { userId: user.id } });
    console.info(
      `User ${email} was succsessfully logged IN:\n${JSON.stringify(employee, null, 2)},\n${JSON.stringify(tokens, null, 2)}`,
    );
  } catch (error) {
    console.error("RefreshToken error:", error);
    throw error;
  }

  return { success: true, ...tokens };
}

// async function logout(id: string) {
//   await employeeController.updateEmployeeOnlineStatus(id, {
//     isOnline: false,
//     lastLoggedIn: new Date(),
//   });
//   await RefreshToken.destroy({
//     where: { userId: id },
//   });
//   const employee = await employeeController.getEmployeeById(id);
//   const proof = {
//     userId: id,
//     email: employee?.email,
//     isOnline: employee?.isOnline,
//     lastLoggedIn: employee?.lastLoggedIn,
//     refreshTokensDeleted: true,
//   };
//   console.info(
//     `User ${employee?.email} was succsessfully logged OUT:\n${JSON.stringify(employee, null, 2)},\n${JSON.stringify(proof, null, 2)}`,
//   );
//   return proof;
// }

async function logout(refreshToken: string) {
  await RefreshToken.destroy({
    where: { token: refreshToken },
  });
  return { refreshTokensDeleted: true };
}

function verifyToken(token: string) {
  return jwt.verify(token, config.jwt.secret);
}

async function verifyRefreshToken(token: string) {
  const storedRefreshToken = await RefreshToken.findAll({
    where: {
      token,
    },
  });

  if (!storedRefreshToken.length) {
    throw new Error("RefreshToken not found.", { cause: 404 });
  }

  return true;
}

export { login, logout, verifyToken, verifyRefreshToken, generateTokenPair };
