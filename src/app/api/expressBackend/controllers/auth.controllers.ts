import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import User from "@/app/api/expressBackend/models/user.model";
import { config } from "@/app/api/expressBackend/config/env.config";
import RefreshToken from "@/app/api/expressBackend/models/refresh-token.model";
import jwt, { SignOptions } from "jsonwebtoken";
import * as employeeController from "@/app/api/expressBackend/controllers/employees.controllers";
import Employee from "@/app/api/expressBackend/models/employee.model";

function generateTokenPair(user: User, rememberMe = false) {
  const accessExpiration = rememberMe
    ? config.jwt.rememberMeAccessExpiration
    : config.jwt.accessExpiration;
  const refreshExpiration = rememberMe
    ? config.jwt.rememberMeRefreshExpiration
    : config.jwt.refreshExpiration;

  const accessToken: string = jwt.sign({ role: user.role }, config.jwt.secret, {
    subject: user.id,
    expiresIn: accessExpiration,
  } as SignOptions);

  const refreshToken: string = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: refreshExpiration,
  } as SignOptions);

  return { accessToken, refreshToken, accessExpiration, refreshExpiration };
}

export interface LoginResult {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  accessExpiration: string;
  refreshExpiration: string;
}

async function login(
  email: string,
  password: string,
  rememberMe = false,
): Promise<LoginResult> {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }
  const result: boolean = bcrypt.compareSync(password, user.password);
  if (!result) {
    throw new Error("Invalid email or password");
  }
  const tokens = generateTokenPair(user, rememberMe);
  const sessionId = uuidv4();
  try {
    await RefreshToken.create({
      userId: user.id,
      token: tokens.refreshToken,
      sessionId,
      loginAt: new Date(),
      rememberMe,
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

async function logout(userId: string, refreshToken?: string) {
  try {
    let deleted = 0;
    if (refreshToken) {
      deleted = await RefreshToken.destroy({ where: { token: refreshToken } });
    }
    if (!deleted && userId) {
      deleted = await RefreshToken.destroy({ where: { userId } });
    }
    if (!deleted) {
      console.error(
        `Could not find refresh token for userId: ${userId} or token: ${refreshToken}`,
      );
    } else {
      console.log(
        `Deleted ${deleted} refresh tokens for userId: ${userId} or token: ${refreshToken}`,
      );
    }
  } catch (error) {
    console.error(
      "could not find token by userId or token, might already be destroyed",
      error,
    );
  }
  return { refreshTokensDeleted: true };
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

function verifyToken(token: string): { role: string; sub: string } | null {
  try {
    return jwt.verify(token, config.jwt.secret) as {
      role: string;
      sub: string;
    };
  } catch {
    return null;
  }
}

export { login, logout, verifyToken, verifyRefreshToken, generateTokenPair };
