/* ! NOTE: as a temp solution i want to keep server.ts and users.route.ts separate to make it easier to work with (less clutter) 
          - so i am going to import whatever i need from server.ts 
          - in server.ts i will add required lines: 
             + import { userRouter } from "../../expressBackend/routers/users.route"; // adjust path as needed
             + app.use("/users", userRouter);

          - in users.route.ts: will operate as normal
*/

import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import { Todo, TodoProps } from "./todo";
import { userRouter } from "@expressBackend/routers/users.route";
// import { userRouter } from "../../expressBackend/routers/users.route"; // !TEMP
// import { userRouter } from "@expressBackend/controllers/users.controllers"; // !TEMP

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

////* GET (w/query)
app.get("/expressTodo", async (req, res) => {
  const id = req.query.id; //how to get queries
  //TODO: Continue from here (filtering)
  let query = 'SELECT * FROM "Todo"';
  const params: QueryParam[] = [];

  // If done parameter exists, filter by it
  if (req.query.done !== undefined) {
    const done = req.query.done === "true";
    query += " WHERE done = $1";
    params.push(done);
  }
  // query += ' ORDER BY "createdAt" ASC, id ASC';
  query += ' ORDER BY "createdAt" DESC, id DESC';
  const result = await pool.query(query, params);
  res.json({
    count: result.rows.length,
    data: result.rows,
  });
});

export type QueryParam = TodoProps[keyof TodoProps];

////* POST
app.post("/expressTodo", async (req, res) => {
  console.log("Received body:", req.body);
  const todo = new Todo(req.body);
  console.log("Created todo:", todo);

  await pool.query(
    `INSERT INTO "Todo" (id, title, done, "dueDate", tags, "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6)`,
    [todo.id, todo.title, todo.done, todo.dueDate, todo.tags, todo.createdAt]
  );
  res.status(201).json(todo);
});

////* DELETE
app.delete("/expressTodo/:id", async (req, res) => {
  await pool.query(`DELETE FROM "Todo" WHERE id = $1`, [req.params.id]);
  res.status(204).send();
});

////* PUT | EDIT
app.put("/expressTodo/:id", async (req, res) => {
  // quick check if empty req
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }
  const updates: string[] = [];
  const params: QueryParam[] = [req.params.id];

  // if the param IS something: push to 'update bucket', else ignore
  (Object.keys(req.body) as Array<keyof TodoProps>).forEach((key) => {
    const val = (req.body as Partial<TodoProps>)[key];
    if (val !== undefined) {
      params.push(val);
      updates.push(`"${String(key)}" = $${params.length}`);
    }
  });

  // push to db when complete.
  await pool.query(
    `UPDATE "Todo" SET ${updates.join(", ")} WHERE id = $1`,
    params
  );

  res.status(200).json({ message: "Todo updated" });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
