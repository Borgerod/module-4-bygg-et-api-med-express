// this should probobly be moves to expressTodo and renamed to actions.

import { Todo } from "@types";
import { Dispatch, SetStateAction } from "react";

const API_BASE = (
  process.env.NEXT_PUBLIC_EXPRESS_URL ?? "http://localhost:4000"
).replace(/\/$/, "");
const api = (path: string) => `${API_BASE}${path}`;

export default function TodoPropsUtils(
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
) {
  async function addTask(data: {
    title: string;
    tags: string;
    dueDate: string;
  }): Promise<void> {
    try {
      const res = await fetch(api("/expressTodo"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          tags: data.tags,
          dueDate: data.dueDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add task");
      }

      const responseData: Todo = await res.json();
      console.log("Task added:", responseData);

      setTodos((prev: Todo[]) => [...prev, responseData]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }
  const deleteTask = async (
    id: string,
    table: string = "Todo",
  ): Promise<void> => {
    try {
      const res = await fetch(api(`/expressTodo/${table}/${id}`), {
        credentials: "include",
        method: "DELETE",
      });
      const responseData: { message?: string; deletedId?: string } =
        await res.json();
      if (res.ok) {
        setTodos((prevTodos) => {
          const newTodos: Todo[] = prevTodos.filter((todo) => todo.id !== id);
          console.log(`todos (after deletion): \n ${newTodos.entries}`);
          return newTodos;
        });
        console.log(
          `responseData (json): ${JSON.stringify(responseData, null, 2)}`,
        );
      }
      if (!res.ok) {
        throw new Error(
          `Error: \n  Failed to delete task; \n ${res.status} - ${res.statusText}`,
        );
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Optionally refetch or rollback
      // todo. add roll back
    }
  };

  async function toggleComplete(
    id: string,
    currentDone: boolean,
  ): Promise<void> {
    const newDone = !currentDone;

    setTodos((prev: Todo[]) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: newDone } : todo)),
    );

    try {
      const res = await fetch(api(`/expressTodo/${id}`), {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle task");
      }

      console.log("Task toggled successfully");
    } catch (error) {
      console.error("Failed to toggle task:", error);
      // Rollback on error
      setTodos((prev: Todo[]) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, done: currentDone } : todo,
        ),
      );
    }
  }

  const editTask = async (id: string, newText: string): Promise<void> => {
    setTodos((prev: Todo[]) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: newText } : todo)),
    );

    try {
      const res = await fetch(api(`/expressTodo/${id}`), {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newText }),
      });

      if (!res.ok) {
        throw new Error("Failed to edit task");
      }
    } catch (error) {
      console.error("Failed to edit task:", error);
      // Rollback on error
      setTodos((prev: Todo[]) =>
        // todo: test this
        prev.map((todo) =>
          todo.id === id ? { ...todo, title: newText } : todo,
        ),
      );
    }
  };

  return { addTask, deleteTask, toggleComplete, editTask };
}
