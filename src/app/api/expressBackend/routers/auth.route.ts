import express, { Request, Response, NextFunction } from "express";
import {
  generateTokenPair,
  login,
  logout,
  verifyRefreshToken,
} from "@/app/api/expressBackend/controllers/auth.controllers";
import RefreshToken from "@/app/api/expressBackend/models/refresh-token.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@/app/api/expressBackend/config/env.config";
import User from "@/app/api/expressBackend/models/user.model";
import { v4 as uuidv4 } from "uuid";

const authRouter = express.Router();

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const getTokenMaxAge = (token: string): number => {
  const decoded = jwt.decode(token) as JwtPayload | null;
  if (!decoded || typeof decoded.exp !== "number") {
    return 0;
  }
  const msLeft = decoded.exp * 1000 - Date.now();
  return msLeft > 0 ? msLeft : 0;
};

const getCookieSecurity = (): { secure: boolean; sameSite: "lax" | "none" } => {
  if (process.env.NODE_ENV === "production") {
    return { secure: true, sameSite: "none" };
  }
  return { secure: false, sameSite: "lax" };
};

const setAuthCookies = (
  res: Response,
  tokens: TokenPair,
  rememberMe = false,
) => {
  const refreshMaxAge = getTokenMaxAge(tokens.refreshToken);
  const accessMaxAge = getTokenMaxAge(tokens.accessToken);
  const { secure, sameSite } = getCookieSecurity();

  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: refreshMaxAge,
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  });

  res.cookie("accessToken", tokens.accessToken, {
    maxAge: accessMaxAge,
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  });
};

const delAuthCookies = (res: Response) => {
  const clearCookie = (name: "refreshToken" | "accessToken") => {
    res.clearCookie(name, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.clearCookie(name, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  };

  clearCookie("refreshToken");
  clearCookie("accessToken");
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
    delAuthCookies(res);
    res.status(200).json({ user: null });
    return;
  }

  try {
    await verifyRefreshToken(actualToken);

    const payloadRefreshToken = jwt.verify(actualToken, config.jwt.secret) as {
      id: string;
    };

    const user = await User.findByPk(payloadRefreshToken.id);

    if (!user) {
      delAuthCookies(res);
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
      rememberMe: (existingToken?.get("rememberMe") as boolean) ?? false,
    });
    setAuthCookies(res, tokens, true);
    res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    delAuthCookies(res);
    next(error);
    return;
  }
};

authRouter.get(
  "/refresh",
  handleRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      delAuthCookies(res);
      res.status(200).json({ user: null });
      return;
    }
    try {
      await verifyRefreshToken(refreshToken);
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as {
        id: string;
      };
      const user = await User.findByPk(decoded.id);
      if (!user) {
        delAuthCookies(res);
        res.status(200).json({ user: null });
        return;
      }

      const existingToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });
      const rememberMe = (existingToken?.get("rememberMe") as boolean) ?? false;

      const tokens = generateTokenPair(user, rememberMe);
      await RefreshToken.upsert({
        userId: user.id,
        token: tokens.refreshToken,
        sessionId: existingToken
          ? (existingToken.get("sessionId") as string)
          : uuidv4(),
        loginAt: new Date(),
        rememberMe,
      });
      setAuthCookies(res, tokens, rememberMe);
      res.json({
        user: { id: user.id, email: user.email, role: user.role },
        ...tokens,
      });
    } catch (error) {
      delAuthCookies(res);
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
    const userId = req.body?.userId as string | undefined;
    if (userId) {
      await logout(userId);
    }
  } finally {
    delAuthCookies(res);
    res.status(204).end();
  }
});

export { authRouter };
