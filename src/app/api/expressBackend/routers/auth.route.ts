import express, { Request, Response, NextFunction } from "express";
import {
  generateTokenPair,
  login,
  logout,
  verifyRefreshToken,
} from "@expressBackend/controllers/auth.controllers";
import RefreshToken from "@expressBackend/models/refresh-token.model";
import jwt from "jsonwebtoken";
import { config, toMilliseconds } from "@expressBackend/config/env.config";
import User from "@expressBackend/models/user.model";

const authRouter = express.Router();

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiration: string;
  refreshExpiration: string;
}

const cookieBase = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
};

const setAuthCookies = (res: Response, tokens: TokenPair) => {
  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieBase,
    maxAge: toMilliseconds(tokens.refreshExpiration),
  });
  res.cookie("accessToken", tokens.accessToken, {
    ...cookieBase,
    maxAge: toMilliseconds(tokens.accessExpiration),
  });
};

const delAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", cookieBase);
  res.clearCookie("accessToken", cookieBase);
};

authRouter.get(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      console.log("No refreshToken in cookies");
      res.status(200).json({ user: null });
      return;
    }

    console.log("Received refreshToken:", refreshToken);
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

      const existingToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });
      if (!existingToken || !existingToken.get("sessionId")) {
        delAuthCookies(res);
        res
          .status(401)
          .json({ message: "Session invalid. Please log in again." });
        return;
      }

      const rememberMe = (existingToken.get("rememberMe") as boolean) ?? false;
      const tokens = generateTokenPair(user, rememberMe);
      await existingToken.update({
        token: tokens.refreshToken,
        loginAt: new Date(),
        rememberMe,
      });
      setAuthCookies(res, tokens);
      res.json({
        user: { id: user.id, email: user.email, role: user.role },
        ...tokens,
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        let dbError = null;
        let cookieError = null;
        try {
          await RefreshToken.destroy({ where: { token: refreshToken } });
        } catch (err) {
          dbError = err;
          console.error(
            "[auth] Eror while trying to delete refreshToken from db: \n",
            err,
          );
        }
        try {
          delAuthCookies(res);
        } catch (err) {
          cookieError = err;
          console.error(
            "[auth] Error while trying to delete refreshToken from cookies: \n",
            err,
          );
        }
        if (!dbError && !cookieError) {
          console.log(
            "[auth] Expired refresh token detected and removed from DB and cookies.",
          );
        }
      }
      console.log("Error in /refresh:", error);
      res.status(200).json({ user: null });
    }
  },
);

// authRouter.get("/refresh/:token", handleRefreshToken);

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body as {
    email: string;
    password: string;
    rememberMe: boolean;
  };
  try {
    const result = await login(email, password, rememberMe === true);
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
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const userId = req.body?.userId as string | undefined;
    if (refreshToken || userId) {
      await logout(userId ?? "", refreshToken);
    } else {
      console.error("No userId or refreshToken provided in logout request.");
    }
    delAuthCookies(res);
    res.status(204).end();
  } catch (error) {
    console.error("failed to destroy cookies", error);
    res.status(500).end();
  }
});

export { authRouter };
