import express, { Request, Response, NextFunction } from "express";
import {
  generateTokenPair,
  login,
  logout,
  verifyRefreshToken,
} from "@/app/api/expressBackend/controllers/auth.controllers";
import RefreshToken from "@/app/api/expressBackend/models/refresh-token.model";
import jwt from "jsonwebtoken";
import { config } from "@/app/api/expressBackend/config/env.config";
import User from "@/app/api/expressBackend/models/user.model";
import { v4 as uuidv4 } from "uuid";

const authRouter = express.Router();

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const setAuthCookies = (
  res: Response,
  tokens: TokenPair,
  rememberMe = false,
) => {
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000;
  const accessMaxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000
    : 3 * 60 * 60 * 1000;

  res.cookie("refreshToken", tokens.refreshToken, {
    ...(rememberMe ? { maxAge: refreshMaxAge } : {}),
    httpOnly: true,
    secure: true, //? should maybe ser to secure:false ? because i do sort of want to use the cookies that i have made also.
    sameSite: "none",
  });

  res.cookie("accessToken", tokens.accessToken, {
    ...(rememberMe ? { maxAge: accessMaxAge } : {}),
    httpOnly: true,
    secure: true, //? should maybe ser to secure:false ? because i do sort of want to use the cookies that i have made also.
    sameSite: "none",
  });
};

const delAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.env !== "development", //? should maybe set to secure:true ?
    path: "/",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: config.env !== "development", //? should maybe set to secure:true ?
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
      where: { token: actualToken },
    });
    console.log(
      "Fetched existingToken for token",
      actualToken,
      existingToken,
      "",
    );
    await RefreshToken.upsert({
      userId: user.id,
      token: tokens.refreshToken,
      sessionId: existingToken
        ? (existingToken.get("sessionId") as string)
        : uuidv4(),
      loginAt: new Date(),
      rememberMe: (existingToken?.get("rememberMe") as boolean) ?? false,
    });
    setAuthCookies(res, tokens, true);
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
      setAuthCookies(res, tokens, rememberMe);
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

authRouter.get("/refresh/:token", handleRefreshToken);

authRouter.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const result = await login(email, password, rememberMe === true);
    const user = await User.findOne({ where: { email } });
    if (user) {
      setAuthCookies(res, result, rememberMe === true);
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
    const refreshToken = req.cookies?.refreshToken;
    const userId = req.body?.userId;
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
