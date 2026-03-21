import express from "express";
import path from "node:path";

// const rootRouter = new express.Router();
const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "index.html"));
});

rootRouter.get("/new-page.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "view", "new-page.html"));
});

rootRouter.get("/old-page.html", (req, res) => {
  res.redirect(301, "/new-page.html");
});

export { rootRouter };
