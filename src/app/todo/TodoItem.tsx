"use client";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import TodoCheckbox from "@/components/ui/todo/TodoCheckbox";
import { cn } from "@/lib/utils";
import { TodoType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { LuX } from "react-icons/lu";
import Form from "next/form";
import { useState } from "react";
import { handleToggleTodo, handleDeleteTodo } from "./actions";

export function TodoItem(todo: TodoType) {
  const tags = todo.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <TableRow key={todo.id} className="align-top">
      <TableCell id="done complete checkbox checkbox-cell" className="py-2">
        <TodoCheckbox
          todoId={todo.id}
          done={todo.done}
          onToggle={handleToggleTodo}
        />
      </TableCell>
      <TableCell
        id="title title-cell task task-cell"
        className="py-2 wrap-break-word min-w-50 max-w-75"
      >
        <p className={cn("h-full w-full", "text-wrap")}>{todo.title}</p>
      </TableCell>
      <TableCell id="dueDate due-date-cell" className="py-2 whitespace-nowrap">
        {todo.dueDate ? (
          new Date(todo.dueDate).toLocaleDateString("nb-NO", {
            dateStyle: "medium",
          })
        ) : (
          <span>-</span>
        )}
      </TableCell>

      <TableCell className="py-2">
        <Stacks tagArray={tags} />
      </TableCell>

      <TableCell
        id="createdAt created-at-cell"
        className="py-2 whitespace-nowrap"
      >
        {todo.createdAt
          ? new Date(todo.createdAt).toLocaleDateString("nb-NO", {
              dateStyle: "medium",
            })
          : "N/A"}
      </TableCell>

      <TableCell
        id="actions actions-cell delete delete-todo delete-button-cell"
        className="py-2"
      >
        <Form action={handleDeleteTodo} className={cn("inline")}>
          <input type="hidden" name="id" value={todo.id} />
          <Button
            id="delete-button button delete delete-todo"
            type="submit"
            variant="ghost"
            size="sm"
            aria-label="Delete todo"
          >
            <LuX />
          </Button>
        </Form>
      </TableCell>
    </TableRow>
  );
}

type StacksProps = {
  tagArray: string[];
};

function Stacks({ tagArray }: StacksProps) {
  const [itemsToShow, setItemsToShow] = useState(3);
  const showmore = () => {
    setItemsToShow(tagArray.length);
  };

  const showless = () => {
    setItemsToShow(3);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1  h-full w-full",
        itemsToShow > 3 ? "flex-wrap" : "flex-nowrap",
        "",
      )}
    >
      {tagArray.slice(0, itemsToShow).map((tag, index) => (
        <Badge
          key={index}
          variant={"secondary"}
          className={cn("flex items-center h-full", "", "")}
        >
          {tagArray.length > 3 && index === itemsToShow - 1 ? (
            <button
              onClick={itemsToShow === 3 ? showmore : showless}
              className={cn("flex items-center h-full", "", "")}
            >
              {itemsToShow === 3
                ? `+ ${tagArray.length - 3} tags`
                : "Show Less"}
            </button>
          ) : (
            <span className={cn("block", "", "")}>{tag}</span>
          )}
        </Badge>
      ))}
    </div>
  );
}
