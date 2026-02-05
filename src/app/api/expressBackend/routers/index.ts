console.log("Initializing routes...");

import { rootRouter } from "./root.route";
import { authRouter } from "./auth.route";
import { employeesRouter } from "./employee.route";
import { userRouter } from "./user.route";

import type { Application, Router } from "express";

const routes = {
  root: rootRouter,
  users: userRouter,
  auth: authRouter,
  employees: employeesRouter,
};

interface Routes {
  root: Router;
  users: Router;
  auth: Router;
  employees: Router;
}

function populateRoutes(app: Application): void {
  app.use("/", routes["root"]);
  console.log(`Added routes for collection "root" => "/"`);
  for (const collection in routes) {
    if (collection === "root") continue;

    app.use(`/${collection}`, routes[collection as keyof Routes]);
    console.log(
      `Added routes for collection "${collection}" => "/${collection}"`,
    );
  }
}

console.log("Routes initialized!");

export { routes, populateRoutes };
