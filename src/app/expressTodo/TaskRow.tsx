import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LuX } from "react-icons/lu";
import { cn } from "@lib/utils";
import { Todo } from "@types";

interface TaskCardProps {
  todo: Todo;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, currentDone: boolean) => Promise<void>;
  onEdit: (id: string, newText: string) => Promise<void>;
}

export default function TaskRow({
  todo,
  onDelete,
  onToggle,
  onEdit,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(todo.title || "");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newText.trim()) {
      onEdit(todo.id, newText.trim());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={6}>
          <form
            onSubmit={onSubmit}
            className={cn("flex w-full items-center gap-2", "", "")}
          >
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className={cn("flex-1 bg-transparent", "", "")}
              aria-label={`Edit ${todo.title}`}
            />
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setNewText(todo.title);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </form>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={todo.id} className={cn("align-top", "", "")}>
      <TableCell className={cn("py-2 w-16", "", "")}>
        <Checkbox
          checked={Boolean(todo.done)}
          onCheckedChange={() => onToggle(todo.id, Boolean(todo.done))}
        />
      </TableCell>

      <TableCell
        className={cn("py-2 wrap-break-word min-w-50 max-w-75", "", "")}
      >
        <p
          className={cn("h-full w-full text-wrap", "", "")}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </p>
      </TableCell>

      <TableCell className={cn("py-2 whitespace-nowrap w-24", "", "")}>
        <span
          className={cn(
            "",
            {
              "text-primary":
                !todo.dueDate || new Date(todo.dueDate) > new Date(),
              "text-warning":
                todo.dueDate && new Date(todo.dueDate) <= new Date(),
            },
            "",
            "",
          )}
        >
          {todo.dueDate instanceof Date &&
          todo.dueDate.toISOString() === "3000-01-01T00:00:00.000Z"
            ? "-"
            : new Date(todo.dueDate).toLocaleDateString("nb-NO", {
                dateStyle: "medium",
              })}
        </span>
      </TableCell>

      <TableCell className={cn("py-2 w-32", "", "")}>
        <div className={cn("flex flex-wrap gap-1", "", "")}>
          {typeof todo.tags === "string" && todo.tags.trim() !== ""
            ? todo.tags
                .split(",")
                .filter(
                  (tag: string) =>
                    tag.trim() !== "untagged" && tag.trim() !== "",
                )
                .map((tag: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className={cn("text-xs break-all", "", "")}
                  >
                    {tag}
                  </Badge>
                ))
            : null}
        </div>
      </TableCell>

      <TableCell className={cn("py-2 whitespace-nowrap w-24", "", "")}>
        {todo.createdAt
          ? new Date(todo.createdAt).toLocaleDateString("nb-NO", {
              dateStyle: "medium",
            })
          : "N/A"}
      </TableCell>

      <TableCell className={cn("py-2 w-16", "", "")}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Delete todo"
          onClick={() => onDelete(todo.id)}
        >
          <LuX />
        </Button>
      </TableCell>
    </TableRow>
  );
}
