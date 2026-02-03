// import express from "express";
import express, { Request, Response, NextFunction } from "express";

import {
  generateTokenPair,
  login,
  logout,
  verifyRefreshToken,
} from "@/app/api/expressBackend/controllers/auth.controllers";
import RefreshToken from "@/app/api/expressBackend/models/refresh-token.model";
import {
  AuthSchemaLogin,
  AuthSchemaLogout,
} from "@/app/api/expressBackend/schema/auth.schema";
import jwt from "jsonwebtoken";
import { config } from "@/app/api/expressBackend/config/env.config";
import { validateRequest } from "@/app/api/expressBackend/middleware/useValidate.middleware";
import User from "@/app/api/expressBackend/models/user.model";
import { v4 as uuidv4 } from "uuid";

const authRouter = express.Router();

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const setAuthCookies = (res: Response, tokens: TokenPair) => {
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  const minAge = 3 * 60 * 60 * 1000;

  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: maxAge,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.cookie("accessToken", tokens.accessToken, {
    maxAge: minAge,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

const delAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.env !== "development",
    path: "/",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: config.env !== "development",
    path: "/",
  });
};

const handleRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.params;
  const headerRefreshToken = req.cookies.refreshToken;
  const actualToken = token || headerRefreshToken || null;

  if (actualToken === null) {
    throw new Error("Bad request", { cause: 400 });
  }

  try {
    await verifyRefreshToken(actualToken);

    // Use verify instead of decode
    const payloadRefreshToken = jwt.verify(actualToken, config.jwt.secret) as {
      id: string;
    };

    const user = await User.findByPk(payloadRefreshToken.id);

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const tokens = generateTokenPair(user);
    const existingToken = await RefreshToken.findOne({
      where: { userId: user.id },
    });
    await RefreshToken.upsert({
      userId: user.id,
      token: tokens.refreshToken,
      sessionId: existingToken
        ? (existingToken.get("sessionId") as string)
        : uuidv4(),
      loginAt: new Date(),
    });
    setAuthCookies(res, tokens);
    res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    next(error);
    return;
  }
};
authRouter.get(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log("Received refreshToken:", refreshToken);
    if (!refreshToken) {
      console.log("No refreshToken in cookies");
      res.status(200).json({ user: null });
      return;
    }
    try {
      await verifyRefreshToken(refreshToken);
      console.log("Refresh token verified");
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as {
        id: string;
      };
      console.log("Decoded refresh token:", decoded);
      const user = await User.findByPk(decoded.id);
      console.log("User found by decoded id:", user);
      if (!user) {
        console.log("No user found for id:", decoded.id);
        res.status(200).json({ user: null });
        return;
      }
      // Generate new tokens
      const tokens = generateTokenPair(user);
      // Update the refresh token in DB for this user
      await RefreshToken.upsert({
        userId: user.id,
        token: tokens.refreshToken,
        sessionId: uuidv4(),
        loginAt: new Date(),
      });
      // Set new tokens in cookies
      setAuthCookies(res, tokens);
      // Return the full user object (or select fields)
      res.json({
        user: { id: user.id, email: user.email, role: user.role },
        ...tokens,
      });
    } catch (error) {
      console.log("Error in /refresh:", error);
      res.status(200).json({ user: null });
    }
  },
);
authRouter.get("/refresh/:token", handleRefreshToken);

// authRouter.post(
//   "/login",
//   validateRequest({ bodySchema: AuthSchemaLogin }),
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;
//     try {
//       const result = await login(email, password);
//       setAuthCookies(res, result);
//       res.json(result);
//     } catch (error) {
//       next(error);
//       // res.sendStatus(err.cause ?? 401);
//       return;
//     }
//   },
// );

import { SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login(email, password);
    const user = await User.findOne({ where: { email } });
    if (user) {
      setAuthCookies(res, result);
      res.status(200).json({
        user: { id: user.id, email: user.email, role: user.role },
        ...result,
      });
    } else {
      res.status(401).json({ user: null });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: "Error logging in", error: err.message });
    } else {
      res
        .status(500)
        .json({ message: "Error logging in", error: "Unknown error" });
    }
  }
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    console.log("Logout request body:", req.body); // Add this line
    const userId = req.body?.userId;
    if (userId) {
      await logout(userId);
    } else {
      console.log("No userId provided in logout request.");
    }
    delAuthCookies(res);
    // res.clearCookie("refreshToken", {
    //   httpOnly: true,
    //   secure: config.env !== "development",
    //   path: "/",
    // });
    // res.clearCookie("accessToken", {
    //   httpOnly: true,
    //   secure: config.env !== "development",
    //   path: "/",
    // });

    res.status(204).end();
  } catch (error) {
    console.error("failed to destroy cookies", error);
    res.status(500).end();
  }
});

export { authRouter };
