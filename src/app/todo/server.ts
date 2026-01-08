// Thought i might do a puse express soluton for the filter, it is redundant and is only here to show it.
import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());

// Empty todo data array
const todos: { id: number; title: string; completed: boolean }[] = [];

// GET /todos with optional filter
app.get("/todos", (req, res) => {
	let filteredTodos = todos;

	// Filter by 'completed' query param
	if (req.query.completed !== undefined) {
		const completed = req.query.completed === "true";
		filteredTodos = todos.filter((todo) => todo.completed === completed);
	}

	res.json(filteredTodos);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
