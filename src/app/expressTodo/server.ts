import express from "express";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { Todo, TodoProps } from "@types";
import { userRouter } from "@/app/api/expressBackend/routers/user.route";
import { sequelize } from "@/app/api/expressBackend/config/db.config";
import { employeesRouter } from "@/app/api/expressBackend/routers/employee.route";
import { authRouter } from "@/app/api/expressBackend/routers/auth.route";
import os from "os";
import { Request, Response } from "express";
import { isAuthenticated } from "@/app/api/expressBackend/middleware/isAuthenticated.middleware";
import { useRequestId } from "@/app/api/expressBackend/middleware/useRequestId.middleware";
import { configureApp } from "@expressBackend/config/server.config";
import cookieParser from "cookie-parser";

dotenv.config();

export const db = new Database(
  process.env.DATABASE_URL?.replace("file:", "") ?? "./dev.db",
);

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middleware
app.use(useRequestId);

// Routes
app.use("/users", userRouter);
app.use("/employees", employeesRouter);
app.use("/auth", authRouter);

function validateTableAndId(
  table: string,
  id: string,
): { validatedTable: string } | { error: string; status: number } {
  const tableMap: Record<string, string> = {
    Todo: "Todo",
  };

  const validatedTable = tableMap[table];
  if (!validatedTable) {
    return { error: "Invalid table name", status: 400 };
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return { error: "Invalid ID format", status: 400 };
  }

  return { validatedTable };
}

////* GET (w/query)
app.get(
  "/expressTodo",
  isAuthenticated(["user", "admin"]), // Only allow logged-in users with these roles
  (req, res) => {
    let query = 'SELECT * FROM "Todo"';
    const params: unknown[] = [];

    if (req.query.done !== undefined) {
      query += " WHERE done = ?";
      params.push(req.query.done === "true" ? 1 : 0);
    }
    query += ' ORDER BY "createdAt" DESC, id DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    res.json({
      count: rows.length,
      data: rows,
    });
  },
);

export type QueryParam = TodoProps[keyof TodoProps];

////* POST
app.post("/expressTodo", (req, res) => {
  const todo = new Todo(req.body);

  db.prepare(
    `INSERT INTO "Todo" (id, title, done, "dueDate", tags, "createdAt")
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    todo.id,
    todo.title,
    todo.done ? 1 : 0,
    todo.dueDate ? new Date(todo.dueDate).toISOString() : null,
    todo.tags,
    todo.createdAt
      ? new Date(todo.createdAt).toISOString()
      : new Date().toISOString(),
  );

  res.status(201).json(todo);
});

////* DELETE
app.delete("/expressTodo/:table/:id", (req, res) => {
  const { table, id } = req.params;

  const validation = validateTableAndId(table, id);
  if ("error" in validation) {
    return res.status(validation.status).json({ error: validation.error });
  }

  const { validatedTable } = validation;

  try {
    const stmt = db.prepare(`DELETE FROM "${validatedTable}" WHERE id = ?`);
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ deleted: result.changes });
    console.log(`Deleted {item-id: ${id} from ${validatedTable}}`);
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

////* PUT | EDIT
app.put("/expressTodo/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const stmt = db.prepare("UPDATE todo SET title = ? WHERE id = ?");
    const result = stmt.run(title, id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

//* ERROR HADNLER
app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  },
);

configureApp(app);

sequelize
  .sync()
  .then(() => {
    const port = 4000;
    const localUrl = `http://localhost:${port}`;
    const networkUrl = `http://${os.networkInterfaces()["Ethernet"]?.[1]?.address || "127.0.0.1"}:${port}`;
    console.log(`▲ Express API`);
    console.log(`- Local:         ${localUrl}`);
    console.log(`- Network:       ${networkUrl}`);
    console.log(`- CORS enabled for: http://localhost:3000`);
    app.listen(port, () => {});
  })
  .catch((error) => {
    console.error("Failed to sync database schema:", error);
    process.exit(1);
  });
