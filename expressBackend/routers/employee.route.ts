import express, { Request, Response, NextFunction } from "express";
import * as employeesController from "@expressBackend/controllers/employees.controllers";
import { ZodError } from "zod";

const employeesRouter = express.Router();

employeesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
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

employeesRouter.post(
  "/",
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
employeesRouter.use((req: Request, res: Response, next: NextFunction) => {
  // Log in the same format as your controllers
  console.error(`${req.method} ${req.originalUrl}`, { error: "Not found" });
  const notFoundError = new Error("Not found") as Error & { status?: number };
  notFoundError.status = 404;
  next(notFoundError);
});

// Centralized error handler
employeesRouter.use((err: unknown, req: Request, res: Response): void => {
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
});

export { employeesRouter };
