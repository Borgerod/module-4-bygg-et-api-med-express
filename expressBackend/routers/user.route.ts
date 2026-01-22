import express, { Request, Response } from "express";
import * as userController from "../controllers/users.controllers";
import * as bcrypt from "bcrypt";
import { ZodError } from "zod";

const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  const users = await userController.getUsers();
  console.log("GET /users", users);
  res.json(users);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const id: string = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const user = await userController.getUserById(id);
  console.log(`GET /users/${req.params.id}`, user);
  res.json(user);
});

userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof ZodError) {
      // Return all validation issues as an array
      return res.status(400).json({ errors: err.issues });
    }
    // Use type assertion to access custom properties
    const status = (err as Error & { status?: number }).status ?? 400;
    res.status(status).json({ error: (err as Error).message });
  }
});

// todo make patch

// todo make delete
userRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: string = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const user = await userController.getUserById(id);
  userController.deleteUser(id);
  console.log(`DELETE /users/${req.params.id}`, user);
  res.sendStatus(204);
});
export { userRouter };
