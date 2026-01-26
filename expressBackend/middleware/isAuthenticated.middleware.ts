// import { verifyToken } from "@expressBackend/controllers/auth.controller";
import { verifyToken } from "@expressBackend/controllers/auth.controllers";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    payload?: JwtPayload & { user?: { id: string; role?: string } };
  }
}

export function isAuthenticated(validRoles = ["user"]) {
  return (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers["authorization"]) {
      token = req.headers["authorization"].split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.sendStatus(401);
      return;
    }

    const payload = verifyToken(token);

    if (typeof payload === "string" || !payload) {
      res.sendStatus(403);
      return;
    }

    if (validRoles.includes("admin") && payload.role !== "admin") {
      if (!validRoles.includes("self")) {
        res.sendStatus(403);
        return;
      }
      if (payload.user?.id !== req.params?.id) {
        res.sendStatus(403);
        return;
      }
    }

    req.payload = payload;
    next();
  };
}
