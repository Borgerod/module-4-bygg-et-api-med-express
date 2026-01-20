/* ! NOTE: as a temp solution i want to keep server.ts and users.route.ts separate to make it easier to work with (less clutter) 
          - so i am going to import whatever i need from server.ts 
          - in server.ts i will add required lines: 
             + import { userRouter } from "../../expressBackend/routers/users.route"; // adjust path as needed
             + app.use("/users", userRouter);
*/

import { Router } from "express";
import bcrypt from "bcrypt";
import * as userController from "@expressBackend/controllers/users.controllers";
import {
  UserRegistration,
  UserUpdate,
  User,
} from "@expressBackend/schema/user.schema";

// export type QueryParam = User[keyof User];

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await userController.getUsers();
  res.status(200).json(users);
});

// userRouter.post("/", async (req, res) => {
//   try {
//     const registrationData = UserRegistration.parse(req.body);
//     const passwordHash = await bcrypt.hash(registrationData.password, 10);

//     const userData = {
//       username: registrationData.username,
//       email: registrationData.email,
//       isActive: registrationData.isActive,
//       passwordHash,
//     };

//     const user = await createUser(userData);

//     // Remove passwordHash before sending response without mutating the original object
//     const { passwordHash: _passwordHash, ...safeUser } = user;
//     res.status(201).json(safeUser);
//   } catch (err) {
//     res.status(400).json({ error: err instanceof Error ? err.message : err });
//   }
// });

export { userRouter };
