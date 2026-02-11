"use client";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import TodoCheckbox from "@/components/ui/todo/TodoCheckbox";
import { cn } from "@/lib/utils";
import { TodoType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { LuX } from "react-icons/lu";
import Form from "next/form";
import { useEffect, useState } from "react";
import { handleToggleTodo, handleDeleteTodo } from "./actions";

export function TodoItem(todo: TodoType) {
  const tags = todo.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <TableRow key={todo.id} className={cn("align-top", "gap-0", "", "")}>
      <TableCell
        id="done complete checkbox checkbox-cell"
        className={cn("py-1 px-2", "", "")}
      >
        <TodoCheckbox
          todoId={todo.id}
          done={todo.done}
          onToggle={handleToggleTodo}
        />
      </TableCell>
      <TableCell
        id="title title-cell task task-cell"
        className={cn(
          "py-1 px-2 wrap-break-word min-w-20 max-w-40 truncate",
          "",
          "",
        )}
      >
        <p className={cn("h-full w-full text-wrap truncate", "", "")}>
          {todo.title}
        </p>
      </TableCell>
      <TableCell
        id="dueDate due-date-cell"
        className={cn("py-1 px-2 whitespace-nowrap", "", "")}
      >
        {todo.dueDate ? (
          <>
            <span className={cn("hidden lg:inline", "", "")}>
              {(() => {
                const date = new Date(todo.dueDate);
                const locale = "nb-NO";
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = String(date.getFullYear()).slice(-2);
                const timeStr = date.toLocaleTimeString(locale, {
                  timeStyle: "short",
                });
                return `${day}.${month}.${year} ${timeStr}`;
              })()}
            </span>
            <span className={cn("hidden sm:inline lg:hidden", "", "")}>
              {(() => {
                const date = new Date(todo.dueDate);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = String(date.getFullYear()).slice(-2);
                const timeStr = date.toLocaleTimeString("nb-NO", {
                  timeStyle: "short",
                });
                return `${day}.${month}.${year} ${timeStr}`;
              })()}
            </span>
            <span className={cn("inline sm:hidden", "", "")}>
              {(() => {
                const date = new Date(todo.dueDate);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = String(date.getFullYear()).slice(-2);
                return `${day}.${month}.${year}`;
              })()}
            </span>
          </>
        ) : (
          <span>-</span>
        )}
      </TableCell>
      <TableCell className={cn("py-1 px-2", "", "")}>
        <TagArray tagArray={tags} />
      </TableCell>
      <TableCell
        id="createdAt created-at-cell"
        className={cn(
          "py-1 px-2 whitespace-nowrap hidden md:table-cell",
          "",
          "",
        )}
      >
        {todo.createdAt
          ? new Date(todo.createdAt).toLocaleString("nb-NO", {
              timeStyle: "short",
              dateStyle: "short",
            })
          : "N/A"}
      </TableCell>
      <TableCell
        id="actions actions-cell delete delete-todo delete-button-cell"
        className={cn("py-1 px-0", "", "")}
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

type TagArrayProps = {
  tagArray: string[];
};

function TagArray({ tagArray }: TagArrayProps) {
  const getDefaultItemsToShow = () => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        return 3;
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        return 2;
      } else {
        return 0;
      }
    }
    return 3;
  };

  const [itemsToShow, setItemsToShow] = useState(getDefaultItemsToShow);

  useEffect(() => {
    const updateItems = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setItemsToShow(3);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setItemsToShow(2);
      } else {
        setItemsToShow(0);
      }
    };
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const showmore = () => {
    setItemsToShow(tagArray.length);
  };

  const showless = () => {
    setItemsToShow(getDefaultItemsToShow());
  };

  if (itemsToShow === 0 && tagArray.length > 0) {
    return (
      <div className={cn("flex items-center gap-1 h-full w-full", "", "")}>
        <Badge
          variant={"secondary"}
          className={cn("flex items-center h-full", "", "")}
        >
          <button
            onClick={showmore}
            className={cn("flex items-center h-full", "", "")}
          >
            + {tagArray.length} tags
          </button>
        </Badge>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 h-full w-full",
        itemsToShow < tagArray.length ? "flex-nowrap" : "flex-wrap",
        "",
      )}
    >
      {tagArray.slice(0, itemsToShow).map((tag, index) => (
        <Badge
          key={index}
          variant={"secondary"}
          className={cn("flex items-center h-full", "", "")}
        >
          {tagArray.length > itemsToShow && index === itemsToShow - 1 ? (
            <button
              onClick={itemsToShow === tagArray.length ? showless : showmore}
              className={cn("flex items-center h-full", "", "")}
            >
              {itemsToShow === tagArray.length
                ? "Show Less"
                : `+ ${tagArray.length - itemsToShow} tags`}
            </button>
          ) : (
            <span className={cn("block", "", "")}>{tag}</span>
          )}
        </Badge>
      ))}
    </div>
  );
}
