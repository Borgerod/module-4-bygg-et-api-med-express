import express, { Request, Response, NextFunction } from "express";
import * as userController from "@/app/api/expressBackend/controllers/users.controllers";
import { ZodError } from "zod";
import { isAuthenticated } from "@/app/api/expressBackend/middleware/isAuthenticated.middleware";
import { validateRequest } from "@/app/api/expressBackend/middleware/useValidate.middleware";
import { UserSchemaCreate } from "@/app/api/expressBackend/schema/user.schema";

const userRouter = express.Router();

userRouter.get(
  "/",
  isAuthenticated(["admin"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userController.getUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.get(
  "/:id",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const user = await userController.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.post(
  "/",
  // isAuthenticated(["admin"]), //keep if userRegistration should be monitored by admins (for example if the only users for this app are employees)
  isAuthenticated(["admin", "self"]), //NOTE: same consern as in employee.route.
  validateRequest({ bodySchema: UserSchemaCreate }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userController.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.patch(
  "/:id",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const { body } = req;
      const result = await userController.updateUser(id, body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.delete(
  "/:id",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      await userController.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// Catch-all 404 logger for unmatched routes
userRouter.use((req: Request, _res: Response, next: NextFunction) => {
  // Log in the same format as your controllers
  console.error(`${req.method} ${req.originalUrl}`, { error: "Not found" });
  const notFoundError = new Error("Not found") as Error & { status?: number };
  notFoundError.status = 404;
  next(notFoundError);
});

// Centralized error handler
userRouter.use((err: ZodError | Error, _req: Request, res: Response): void => {
  if (res.headersSent) {
    return;
  }
  console.error("userRouter-Error:", err);

  const status =
    typeof (err as unknown as { status?: unknown }).status === "number"
      ? (err as unknown as { status: number }).status
      : 500;
  res.status(status).json({ success: false, error: (err as Error).message });
});

export { userRouter };
