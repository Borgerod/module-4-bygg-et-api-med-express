import { serializeTodo, Todo } from "@/app/todo/types";
import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

// Cached fetch for todos
export const getTodos = unstable_cache(
	async (): Promise<Todo[]> => {
		const todos = await prisma.todo.findMany({
			orderBy: {
				createdAt: "asc",
			},
		});
		return todos.map(serializeTodo);
	},
	["todos"],
	{ tags: ["todos"] }
);

export async function addTodo(
	title: string,
	tags: string[],
	dueDate?: Date,
	createdAt?: Date
) {
	const todo = await prisma.todo.create({
		data: {
			title,
			done: false,
			dueDate: dueDate ?? null,
			tags: tags.join(","),
			createdAt: createdAt ?? new Date(),
		},
	});
	return serializeTodo(todo);
}

export async function updateTodo(
	id: number,
	updates: { title?: string; done?: boolean; dueDate?: Date; tags?: string[] }
) {
	const todo = await prisma.todo.update({
		where: { id },
		data: {
			...updates,
			tags: updates.tags ? updates.tags.join(",") : undefined,
		},
	});
	return serializeTodo(todo);
}

export async function deleteTodo(id: number) {
	await prisma.todo.delete({ where: { id } });
	return true;
}
