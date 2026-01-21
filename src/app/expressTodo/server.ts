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
import { userRouter } from "@expressBackend/routers/users.route";
import { sequelize } from "@expressBackend/config/db.config"; // adjust path as needed

dotenv.config();

export const db = new Database(
  process.env.DATABASE_URL?.replace("file:", "") ?? "./dev.db",
);

const app = express();
app.use(express.json());
app.set("trust proxy", true);

app.use("/users", userRouter);

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
    // User: "User",
    // ActiveLogins: "ActiveLogins"
    // Have put 'User' and 'ActiveLogins' here for when im going to merge the expressBackend with this
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
// app.patch("/expressTodo/:id", (req, res) => {
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

sequelize.sync({ alter: true }).then(() => {
  console.log("Database schema synced to model.");
  app.listen(4000, () => {
    console.log("Server running on port 4000");
  });
});
