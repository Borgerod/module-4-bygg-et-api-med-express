"use client";

import { Todo } from "@types";
import { createContext, useContext, ReactNode } from "react";

type TodoContextType = {
  todos: Todo[];
};

const TodoContext = createContext<TodoContextType>({
  todos: [],
});

export function TodoProvider({
  children,
  todos,
}: {
  children: ReactNode;
  todos: Todo[];
}) {
  return (
    <TodoContext.Provider value={{ todos }}>{children}</TodoContext.Provider>
  );
}

export function useTodos(): TodoContextType {
  return useContext(TodoContext);
}
