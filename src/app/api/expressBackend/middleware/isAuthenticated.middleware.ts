import { verifyToken } from "@/app/api/expressBackend/controllers/auth.controllers";
import { Request, Response, NextFunction } from "express";

type AuthPayload = { role: string; sub: string };

export function isAuthenticated(validRoles: string[] = ["user"]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const cookieToken =
      typeof req.cookies?.accessToken === "string"
        ? req.cookies.accessToken
        : null;
    const token = bearerToken ?? cookieToken;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const payload = (await verifyToken(token)) as AuthPayload | null;
    if (!payload || !validRoles.includes(payload.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    (req as Request & { user?: AuthPayload }).user = payload;
    next();
  };
}
