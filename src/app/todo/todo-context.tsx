"use client";

import { createContext, useContext, useOptimistic, useTransition } from "react";
import { Todo } from "./types";
import { handleToggleDone, handleDeleteTodo, handleDuplicate } from "./actions";

type TodoContextType = {
	todos: Todo[];
	toggleDone: (id: number, done: boolean) => void;
	removeTodo: (id: number) => void;
	duplicateTodo: (todo: Todo) => void;
	isPending: boolean;
};

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({
	children,
	initialTodos,
}: {
	children: React.ReactNode;
	initialTodos: Todo[];
}) {
	const [isPending, startTransition] = useTransition();
	const [optimisticTodos, setOptimisticTodos] = useOptimistic(
		initialTodos,
		(state: Todo[], action: { type: string; payload: unknown }) => {
			switch (action.type) {
				case "TOGGLE_DONE": {
					const { id, done } = action.payload as {
						id: number;
						done: boolean;
					};
					return state.map((todo) =>
						todo.id === id ? { ...todo, done } : todo
					);
				}
				case "DELETE": {
					const id = action.payload as number;
					return state.filter((todo) => todo.id !== id);
				}
				case "DUPLICATE": {
					const todo = action.payload as Todo;
					const newTodo: Todo = {
						...todo,
						id: Date.now(), // Temporary ID
						createdAt: new Date().toISOString(),
					};
					return [...state, newTodo];
				}
				default:
					return state;
			}
		}
	);

	const toggleDone = (id: number, done: boolean) => {
		startTransition(async () => {
			setOptimisticTodos({ type: "TOGGLE_DONE", payload: { id, done } });
			await handleToggleDone(id, done);
		});
	};

	const removeTodo = (id: number) => {
		startTransition(async () => {
			setOptimisticTodos({ type: "DELETE", payload: id });
			await handleDeleteTodo(id);
		});
	};

	const duplicateTodo = (todo: Todo) => {
		startTransition(async () => {
			setOptimisticTodos({ type: "DUPLICATE", payload: todo });
			await handleDuplicate(
				todo.title,
				todo.tags,
				todo.dueDate ?? undefined
			);
		});
	};

	return (
		<TodoContext.Provider
			value={{
				todos: optimisticTodos,
				toggleDone,
				removeTodo,
				duplicateTodo,
				isPending,
			}}
		>
			{children}
		</TodoContext.Provider>
	);
}

export function useTodos() {
	const context = useContext(TodoContext);
	if (!context) {
		throw new Error("useTodos must be used within a TodoProvider");
	}
	return context;
}
