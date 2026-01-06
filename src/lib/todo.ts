import { prisma } from "./prisma";

// Fetch all todos from the database
export async function getTodos() {
	return prisma.todo.findMany();
}

// Add a new todo to the database
export async function addTodo(title: string, tags: string[], dueDate?: Date) {
	return prisma.todo.create({
		data: {
			title,
			done: false,
			dueDate,
			tags: tags.join(","),
			createdAt: new Date(),
		},
	});
}

// Update a todo in the database
export async function updateTodo(
	id: number,
	updates: { title?: string; done?: boolean; dueDate?: Date; tags?: string[] }
) {
	return prisma.todo.update({
		where: { id },
		data: {
			...updates,
			tags: updates.tags ? updates.tags.join(",") : undefined,
		},
	});
}

// Delete a todo from the database
export async function deleteTodo(id: number) {
	await prisma.todo.delete({ where: { id } });
	return true;
}
