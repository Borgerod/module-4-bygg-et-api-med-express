/* 
  ! NOTE: as a temp solution i want to keep server.ts and users.route.ts separate to make it easier to work with (less clutter) 
          - so i am going to import whatever i need from server.ts 
          - in server.ts i will add required lines: 
             + import { userRouter } from "../../expressBackend/routers/users.route"; // adjust path as needed
             + app.use("/users", userRouter);

          - in users.route.ts: will operate as normal
*/

import express from "express";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { Todo, TodoProps } from "@types";
import { userRouter } from "@expressBackend/routers/user.route";
import { sequelize } from "@expressBackend/config/db.config"; // adjust path as needed
import { employeesRouter } from "@expressBackend/routers/employee.route";
import { authRouter } from "@expressBackend/routers/auth.route";
import os from "os";
import cookieParser from "cookie-parser";

dotenv.config();

export const db = new Database(
  process.env.DATABASE_URL?.replace("file:", "") ?? "./dev.db",
);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/employees", employeesRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

function validateTableAndId(
  table: string,
  id: string,
): { validatedTable: string } | { error: string; status: number } {
  //? perhaps i should not have this one here
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
app.get("/expressTodo", (req, res) => {
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
});

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

  // seperated te validator so i can reuse it, which i cant be bothered to actually do.
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

sequelize
  /*  *refactor .sync
  -     do: remove this '{ alter: true }' form '.sync()' - 
  - reason: tries to alter update Users (remove + replace), 
            but SQLite prevents this due to Employees are dependant on it.
            resulting in server crash 
*/
  .sync() // refactor .sync*
  .then(() => {
    const port = 4000;
    const localUrl = `http://localhost:${port}`;
    const networkUrl = `http://${os.networkInterfaces()["Ethernet"]?.[1]?.address || "127.0.0.1"}:${port}`;
    console.log(`▲ Express API`);
    console.log(`- Local:         ${localUrl}`);
    console.log(`- Network:       ${networkUrl}`);
    console.log(`- Environments:  .env`);
    app.listen(port, () => {});
  })
  .catch((error) => {
    console.error("Failed to sync database schema:", error);
    process.exit(1);
  });
