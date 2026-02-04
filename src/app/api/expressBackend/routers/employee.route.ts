import express, { Request, Response, NextFunction } from "express";
import * as employeesController from "@/app/api/expressBackend/controllers/employees.controllers";
import { ZodError } from "zod";
import { isAuthenticated } from "@expressBackend/middleware/isAuthenticated.middleware";

const employeesRouter = express.Router();

employeesRouter.get(
  "/",
  isAuthenticated(["admin"]),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const employeess = await employeesController.getEmployees();
      res.status(200).json(employeess);
    } catch (error) {
      next(error);
    }
  },
);

employeesRouter.get(
  "/:id",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const employees = await employeesController.getEmployeeById(id);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  },
);

employeesRouter.get(
  "/by-user/:userId",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;
      const employees = await employeesController.getEmployeeByUserId(userId);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  },
);

employeesRouter.post(
  "/",
  isAuthenticated(["admin"]), //NOTE: this might complicate thing due to the fact that i have split up EmployeeCreation into two parts one filled by new employee and one by admin. ref:"src\app\signup\page.tsx"
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await employeesController.createEmployee(req.body);
      res.status(201).json(employees);
    } catch (error) {
      next(error);
    }
  },
);

employeesRouter.patch(
  "/:id",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const { body } = req;
      const result = await employeesController.updateEmployee(id, body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

// same as patch, but:
// Update data for an employee based on id; if the id does not exist.
employeesRouter.put(
  "/:id",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const { body } = req;
      const result = await employeesController.updateEmployee(id, body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

employeesRouter.delete(
  "/:id",
  isAuthenticated(["admin", "self"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      await employeesController.deleteEmployee(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// Catch-all 404 logger for unmatched routes
employeesRouter.use((req: Request, _res: Response, next: NextFunction) => {
  // Log in the same format as your controllers
  console.error(`${req.method} ${req.originalUrl}`, { error: "Not found" });
  const notFoundError = new Error("Not found") as Error & { status?: number };
  notFoundError.status = 404;
  next(notFoundError);
});

// Centralized error handler
employeesRouter.use(
  (err: ZodError | Error, _req: Request, res: Response): void => {
    if (res.headersSent) {
      return;
    }
    console.error("employeesRouter-Error:", err);

    const status =
      typeof (err as unknown as { status?: unknown }).status === "number"
        ? (err as unknown as { status: number }).status
        : 500;
    res.status(status).json({ success: false, error: (err as Error).message });
  },
);

export { employeesRouter };
