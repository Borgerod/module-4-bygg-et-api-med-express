// In-memory store for todos
let todos: {
	id: number;
	title: string;
	done: boolean;
	dueDate?: Date;
	tags: string[];
	createdA: Date;
}[] = [];
let nextId = 1;

export async function getTodos() {
	return todos;
}

export async function addTodo(title: string, tags: string[], dueDate?: Date) {
	const todo = {
		id: nextId++,
		title,
		done: false,
		dueDate: dueDate,
		tags,
		createdA: new Date(),
	};
	todos.push(todo);
	return todo;
}

export async function updateTodo(
	id: number,
	updates: { title: string; done: boolean; dueDate: Date; tags: string[] }
) {
	const todo = todos.find((t) => t.id === id);
	if (!todo) return null;
	if (typeof updates.title === "string") todo.title = updates.title;
	if (typeof updates.done === "boolean") todo.done = updates.done;
	if (updates.dueDate instanceof Date) todo.dueDate = updates.dueDate;
	if (Array.isArray(updates.tags)) todo.tags = updates.tags;
	return todo;
}

export async function deleteTodo(id: number) {
	const index = todos.findIndex((t) => t.id === id);
	if (index === -1) return false;
	todos.splice(index, 1);
	return true;
}
