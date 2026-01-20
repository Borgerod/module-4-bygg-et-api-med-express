"use client";
import React from "react";
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

interface TodoListProps {
  todos: TodoType[];
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, currentDone: boolean) => Promise<void>;
  onEdit: (id: string, newText: string) => Promise<void>;
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
}

export default function TodoList({
  todos,
  onDelete,
  onToggle,
  setTodos,
}: TodoListProps) {
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
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TaskRow
              key={todo.id}
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))
        ) : (
          <TableRow>
            <td
              colSpan={6}
              className={cn(
                "text-center py-4 text-muted-foreground",
                "max-w-160",
                "min-w-100",
                "flex",
                "",
                "",
              )}
            >
              No tasks...
            </td>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
