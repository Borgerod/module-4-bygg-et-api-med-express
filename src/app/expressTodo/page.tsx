"use server"; //server components are the default - I have this for my own readability
import React from "react";
import { TodoTypes } from "@types";
import TodosClients from "@/app/expressTodo/client";

async function fetchTodosFromServer(): Promise<TodoTypes[]> {
  const expressUrl = process.env.NEXT_PUBLIC_EXPRESS_URL ?? "http://localhost:4000";
  const url = expressUrl
    ? `${expressUrl.replace(/\/$/, "")}/expressTodo`
    : "/expressTodo";
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return data.data || data;
}

export default async function Page() {
  const todos = await fetchTodosFromServer();
  return (
    <div className="p-8 space-y-4 h-full">
      <TodosClients initialTodos={todos} />
    </div>
  );
}
