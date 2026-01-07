// Database type (matches Prisma schema)
export type TodoDb = {
	id: number;
	done: boolean;
	title: string;
	dueDate: Date | null;
	tags: string; // Stored as comma-separated string in DB
	createdAt: Date;
};

// Client type (used in components)
export type Todo = {
	id: number;
	done: boolean;
	title: string;
	dueDate: string | null; // Serialized for client
	tags: string[]; // Parsed array for client
	createdAt: string; // Serialized for client
};

// Transformation function
export function serializeTodo(todo: TodoDb): Todo {
	return {
		id: todo.id,
		done: todo.done,
		title: todo.title,
		dueDate: todo.dueDate?.toISOString() ?? null,
		tags: todo.tags
			? todo.tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean)
			: [],
		createdAt: todo.createdAt.toISOString(),
	};
}
