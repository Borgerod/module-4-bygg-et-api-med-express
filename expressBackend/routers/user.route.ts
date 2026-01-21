import express, { Request, Response } from "express";
import * as userController from "../controllers/user.controllers";
import * as bcrypt from "bcrypt";

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

userRouter.post("/", async (req: Request, res: Response) => {
  const { body } = req;
  const { password } = body;
  const hash = bcrypt.hashSync(password, 10);
  body.password = hash;
  const result = userController.createUser(body);
  res.json(result);
});

export { userRouter };
