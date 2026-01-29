import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { DatePicker } from "@/components/ui/todo/DatePicker";
import { Calendar28 as DatePicker } from "./DatePicker";
import { addTodo, deleteTodo, getTodos, updateTodo } from "@/lib/todo";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Form from "next/form";
import { redirect } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import TodoCheckbox from "@/components/ui/todo/TodoCheckbox";

import { LuX } from "react-icons/lu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import PeriodSelect from "./PeriodSelect";
import { Checkbox } from "@/components/ui/checkbox";

export default async function Page() {
  const todos = await getTodos();
  async function handleAddTodo(formData: FormData) {
    "use server";
    const title = formData.get("title")?.toString().trim() || "";
    if (!title) throw new Error("Title is required");
    await addTodo(
      title,
      formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [],
      formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string)
        : undefined,
    );
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

  async function handleToggleTodo(prevState: unknown, formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const done = formData.get("done") === "on";
    await updateTodo(id, { done });
    redirect("/todo");
  }

  return (
    <>
      <Card
        id="table-card"
        className={cn("flex flex-col", "max-h-150", "w-full", "", "")}
      >
        <CardHeader className="shrink-0">
          <CardTitle>TO DO LIST</CardTitle>
          <CardDescription>
            Manage, monitor and edit your schedule
          </CardDescription>
          <CardAction>
            <PeriodSelect />
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0">
          <ScrollArea className="h-full">
            <div className="px-6 pb-4">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow className="text-left text-sm font-medium text-muted-foreground">
                    {["Done", "Task", "Due", "Tags", "Created", ""].map(
                      (h, i) => (
                        <TableHead key={`h-${i}`} className={cn("")}>
                          {h}
                        </TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y">
                  {todos.map((todo) => (
                    <TableRow key={todo.id} className="align-top">
                      <TableCell className="py-2 w-16">
                        <TodoCheckbox
                          todoId={todo.id}
                          done={todo.done}
                          onToggle={handleToggleTodo}
                        />

                        {/* <Checkbox
                          checked={Boolean(todo.done)}
                          onCheckedChange={() =>
                            handleToggleTodo(todo.done, )
                            // onToggle(todo.id, Boolean(todo.done))
                          }
                        /> */}
                      </TableCell>
                      <TableCell className="py-2 wrap-break-word min-w-50 max-w-75 ">
                        <p
                          className={cn(
                            "h-full w-full",
                            "text-wrap ",
                            "",
                            "",
                            "",
                            "",
                          )}
                        >
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
                          {typeof todo.tags === "string" &&
                          todo.tags.trim() !== ""
                            ? todo.tags
                                .split(",")
                                .filter(
                                  (tag: string) =>
                                    tag.trim() !== "untagged" &&
                                    tag.trim() !== "",
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
                          ? new Date(todo.createdAt).toLocaleDateString(
                              "nb-NO",
                              {
                                dateStyle: "medium",
                              },
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell className="py-2 w-16">
                        <Form
                          action={handleDeleteTodo}
                          style={{
                            display: "inline",
                          }}
                        >
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      {/* _______________________________________________ */}
      <Form className={cn("", "")} action={handleAddTodo}>
        <Card id="form-card">
          {/* TODO: maybe add a "+ button" and make this a popup  */}
          <CardHeader>
            <CardTitle>Add new</CardTitle>

            <CardAction>
              <Button
                variant="outline"
                type="submit"
                className={cn(
                  "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
                  "",
                  "",
                  "",
                )}
              >
                +{/* Add Task */}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-5">
              <Field>
                <Textarea
                  id="task"
                  name="title"
                  placeholder="Describe task.."
                  required
                  className={cn("min-h-20", "resize-none", "", "")}
                />
              </Field>
              <div
                id="field-subgroup"
                className={cn(
                  "flex flex-row",
                  "grid",
                  "grid-cols-[1fr_auto]",
                  "grid-cols-[auto_1fr]",
                  "gap-5",
                  "h-fit",
                  "h-full",
                  "",
                  "",
                )}
              >
                <Field>
                  {/* <DatePicker
                    id="dueDate"
                    name="dueDate"
                    // type="date"
                    placeholder="Due Date"
                  /> */}
                  <DatePicker
                  // id="dueDate"
                  // name="dueDate"
                  // value={dueDate}
                  // onSelect={(v: string) => setDueDate(v)}
                  />
                </Field>
                <Field>
                  <Input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="Add tags (separate with comma)"
                    className={cn(
                      "w-full!",

                      "",
                      "",
                    )}
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </Form>
    </>
  );
}
