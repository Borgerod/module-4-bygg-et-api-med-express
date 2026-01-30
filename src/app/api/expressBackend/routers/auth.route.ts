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

const authRouter = express.Router();

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const setAuthCookies = (res: Response, tokens: TokenPair) => {
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: config.env !== "development",
  });
  res.cookie("accessToken", tokens.accessToken, {
    maxAge: 3 * 60 * 60 * 1000,
    httpOnly: true,
    secure: config.env !== "development",
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
    await RefreshToken.upsert({ userId: user.id, token: tokens.refreshToken }); // Update stored token
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
    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }
    try {
      await verifyRefreshToken(refreshToken);
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as {
        id: string;
      };
      const user = await User.findByPk(decoded.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const tokens = generateTokenPair(user);
      setAuthCookies(res, tokens);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  },
);
authRouter.get("/refresh/:token", handleRefreshToken);

authRouter.post(
  "/login",
  validateRequest({ bodySchema: AuthSchemaLogin }),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const result = await login(email, password);
      setAuthCookies(res, result);
      res.json(result);
    } catch (error) {
      next(error);
      // res.sendStatus(err.cause ?? 401);
      return;
    }
  },
);

authRouter.post("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await RefreshToken.destroy({ where: { token: refreshToken } });
  }
  res.status(204).end();
});

export { authRouter };
