import { getTodos, addTodo, updateTodo, deleteTodo } from "@/lib/todo";

// GET /api/todo
export async function GET() {
	const todos = await getTodos();
	return new Response(JSON.stringify(todos), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

// POST /api/todo
export async function POST(request: Request) {
	try {
		const { text, dueDate, tags } = await request.json();
		if (typeof text !== "string" || !text.trim()) {
			return new Response(JSON.stringify({ error: "Text is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}
		if (dueDate && isNaN(Date.parse(dueDate))) {
			return new Response(
				JSON.stringify({
					error: "dueDate must be a valid date if provided",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
		if (!Array.isArray(tags)) {
			return new Response(
				JSON.stringify({ error: "Tags must be an array" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
		const todo = await addTodo(
			text,
			tags,
			dueDate ? new Date(dueDate) : undefined
		);
		return new Response(JSON.stringify(todo), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (reason) {
		const message =
			reason instanceof Error ? reason.message : "Unexpected error";
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

// PATCH /api/todo?id=1
export async function PATCH(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = Number(searchParams.get("id"));
	if (!id) {
		return new Response(JSON.stringify({ error: "ID is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
	const updates = await request.json();
	const todo = await updateTodo(id, updates);
	if (!todo) {
		return new Response(JSON.stringify({ error: "Todo not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}
	return new Response(JSON.stringify(todo), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

// DELETE /api/todo?id=1
export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = Number(searchParams.get("id"));
	if (!id) {
		return new Response(JSON.stringify({ error: "ID is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
	const success = await deleteTodo(id);
	if (!success) {
		return new Response(JSON.stringify({ error: "Todo not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
