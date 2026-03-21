"use client";
import React, { useState } from "react";
import { TodoType } from "@types";
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { cn } from "@lib/utils";

import TaskRow from "./TaskRow";
import TodoFilters, { FilterType } from "./TodoFilters";

interface TodoListProps {
  todos: TodoType[];
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, currentDone: boolean) => Promise<void>;
  onEdit: (id: string, newText: string) => Promise<void>;
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
}

export default function TodoList({
  todos,
  onDelete,
  onToggle,
  setTodos,
  filter,
  setFilter,
}: TodoListProps) {
  const filteredTodos = todos.filter((todo) => {
    if (filter.includeTags.length === 0) return true;
    const todoTags =
      typeof todo.tags === "string"
        ? todo.tags.split(",").map((t) => t.trim())
        : [];
    return filter.includeTags.every((tag) => todoTags.includes(tag));
  });

  if (!Array.isArray(todos)) return null;

  return (
    <Table>
      <TableHeader className={cn("sticky top-0 bg-background z-10", "", "")}>
        <TableRow
          className={cn(
            "text-left text-sm font-medium text-muted-foreground",
            "",
            "",
          )}
        >
          {["Done", "Task", "Due", "Tags", "Created", ""].map((h, i) => (
            <TableHead key={`h-${i}`}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody className={cn("divide-y", "", "")}>
        {filteredTodos.map((todo) => (
          <TaskRow
            key={todo.id}
            todo={todo}
            todos={todos}
            setTodos={setTodos}
            onDelete={onDelete}
            onToggle={onToggle}
            setFilter={setFilter}
          />
        ))}
      </TableBody>
    </Table>
  );
}
