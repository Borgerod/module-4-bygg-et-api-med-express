"use server";

import { addTodo, deleteTodo, updateTodo } from "@/lib/todo";
import { revalidateTag } from "next/cache";

export async function handleDeleteTodo(id: number) {
	await deleteTodo(id);
	revalidateTag("todos", "default");
}

export async function handleDuplicate(
	title: string,
	tags: string[],
	dueDate?: string
) {
	const parsedDueDate =
		dueDate && dueDate !== "" ? new Date(dueDate) : undefined;
	await addTodo(title, tags, parsedDueDate);
	revalidateTag("todos", "default");
}

export async function handleToggleDone(id: number, done: boolean) {
	await updateTodo(id, { done });
	revalidateTag("todos", "default");
}

export async function handleAddTodo(formData: FormData) {
	const title = formData.get("title") as string;
	if (!title) {
		throw new Error("Title is required");
	}

	const dueDateStr = formData.get("dueDate") as string;
	const tagsStr = formData.get("tags") as string;
	const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : [];
	const dueDate =
		dueDateStr && dueDateStr !== "" ? new Date(dueDateStr) : undefined;

	await addTodo(title, tags, dueDate);
	revalidateTag("todos", "default");
}
