import { verifyToken } from "@/app/api/expressBackend/controllers/auth.controllers";
import { Request, Response, NextFunction } from "express";

export function isAuthenticated(validRoles = ["user"]) {
  return (
    req: Request & { payload?: { role: string; sub: string } },
    res: Response,
    next: NextFunction,
  ) => {
    let token: string | undefined;
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

    if (
      !payload ||
      !(
        (validRoles.includes("admin") && payload.role === "admin") ||
        (validRoles.includes("self") && payload.sub === req.params?.id) ||
        validRoles.includes(payload.role)
      )
    ) {
      res.sendStatus(403);
      return;
    }

    req.payload = payload;
    next();
  };
}
