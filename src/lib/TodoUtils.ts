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
  const createTask = (data: {
    title: string;
    tags: string;
    dueDate: string | null;
  }): Todo => ({
    id: crypto.randomUUID(),
    title: data.title,
    done: false,
    tags: data.tags,
    dueDate: data.dueDate
      ? new Date(data.dueDate)
      : new Date("3000-01-01T00:00:00Z"),
    createdAt: new Date(),
  });

  async function addTask(data: {
    title: string;
    tags: string;
    dueDate: string;
  }): Promise<void> {
    const newTodo = createTask(data);
    setTodos((prev: Todo[]) => [...prev, newTodo]);

    try {
      const res = await fetch(api("/expressTodo"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          tags: data.tags,
          dueDate: data.dueDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add task");
      }

      const responseData = await res.json();
      console.log("Task added:", responseData);
    } catch (error) {
      console.error("Failed to add task:", error);
      // Rollback local state on error
      setTodos((prev: Todo[]) => prev.filter((t) => t.id !== newTodo.id));
    }
  }

  const deleteTask = async (id: string): Promise<void> => {
    // Optimistically update UI
    setTodos((prev: Todo[]) => prev.filter((todo) => todo.id !== id));

    try {
      const res = await fetch(api(`/expressTodo/${id}`), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Optionally refetch or rollback
    }
  };

  async function toggleComplete(
    id: string,
    currentDone: boolean,
  ): Promise<void> {
    const newDone = !currentDone;

    // Optimistically update local state
    setTodos((prev: Todo[]) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: newDone } : todo)),
    );

    try {
      const res = await fetch(api(`/expressTodo/${id}`), {
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
    // Optimistically update local state
    setTodos((prev: Todo[]) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: newText } : todo)),
    );

    try {
      const res = await fetch(api(`/expressTodo/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newText }),
      });

      if (!res.ok) {
        throw new Error("Failed to edit task");
      }
    } catch (error) {
      console.error("Failed to edit task:", error);
      // Optionally rollback
    }
  };

  return { addTask, deleteTask, toggleComplete, editTask };
}
