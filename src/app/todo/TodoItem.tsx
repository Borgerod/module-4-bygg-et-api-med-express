import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import TodoCheckbox from "@/components/ui/todo/TodoCheckbox";
import { cn } from "@/lib/utils";
import { TodoType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { LuX } from "react-icons/lu";
import { redirect } from "next/navigation";
import { deleteTodo, updateTodo } from "@lib/todo";
import Form from "next/form";

// todo: use this
type TodoItemProps = {
  title: string;
  completed: boolean;
};

async function handleToggleTodo(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const done = formData.get("done") === "on";
  await updateTodo(id, { done });
  redirect("/todo");
}

async function handleDeleteTodo(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (id) {
    await deleteTodo(id);
  }
  redirect("/todo");
}

export function TodoItem(todo: TodoType) {
  return (
    <TableRow key={todo.id} className="align-top">
      <TableCell className="py-2 w-16">
        <TodoCheckbox
          todoId={todo.id}
          done={todo.done}
          onToggle={handleToggleTodo}
        />
      </TableCell>
      <TableCell className="py-2 wrap-break-word min-w-50 max-w-75 ">
        <p className={cn("h-full w-full", "text-wrap ", "", "", "", "")}>
          {todo.title}
        </p>
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap w-24">
        {todo.dueDate ? (
          new Date(todo.dueDate).toLocaleDateString("nb-NO", {
            dateStyle: "medium",
          })
        ) : (
          <span>-</span>
        )}
      </TableCell>
      <TableCell className="py-2 w-32">
        <div className="flex flex-wrap gap-1">
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
                    className="text-xs break-all"
                  >
                    {tag}
                  </Badge>
                ))
            : null}
        </div>
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap w-24">
        {todo.createdAt
          ? new Date(todo.createdAt).toLocaleDateString("nb-NO", {
              dateStyle: "medium",
            })
          : "N/A"}
      </TableCell>
      <TableCell className="py-2 w-16">
        <Form action={handleDeleteTodo} className={cn("inline", "", "")}>
          <input type="hidden" name="id" value={todo.id} />
          <Button
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
