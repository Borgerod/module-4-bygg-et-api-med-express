import express, { Request, Response } from "express";
import * as userController from "../controllers/users.controllers";

const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  const users = await userController.getUsers();
  console.log("GET /users", users);
  res.json(users);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const user = await userController.getUserById(req.params.id);
  console.log(`GET /users/${req.params.id}`, user);
  res.json(user);
});

export { userRouter };
