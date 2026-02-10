"use server";
import { deleteTodo, updateTodo } from "@lib/todo";
import { redirect } from "next/navigation";

export async function handleDeleteTodo(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) {
    await deleteTodo(id);
  }
  redirect("/todo");
}

export async function handleToggleTodo(formData: FormData) {
  const id = formData.get("id") as string;
  const done = formData.get("done") === "on";
  await updateTodo(id, { done });
  redirect("/todo");
}
