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
  isAuthenticated(["admin"]), //keep if userRegistration should be monitored by admins (for example if the only users for this app are employees)
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
userRouter.use((req: Request, res: Response, next: NextFunction) => {
  // Log in the same format as your controllers
  console.error(`${req.method} ${req.originalUrl}`, { error: "Not found" });
  const notFoundError = new Error("Not found") as Error & { status?: number };
  notFoundError.status = 404;
  next(notFoundError);
});

// Centralized error handler
userRouter.use(
  (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      return;
    }

    if (err instanceof ZodError) {
      res.status(400).json({ error: err.issues });
      return;
    }

    let status = 500;
    let message = "Internal server error";
    if (typeof err === "object" && err !== null && "message" in err) {
      message = (err as { message: string }).message;
      if (
        "status" in err &&
        typeof (err as { status: number }).status === "number"
      ) {
        status = (err as { status: number }).status;
      }
    }

    res.status(status).json({ error: message });
  },
);

export { userRouter };
