"use client";
import React, { useState } from "react";
import { TodoTypes } from "@types";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuX } from "react-icons/lu";

import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { cn } from "@lib/utils";

import { DatePicker } from "@/components/ui/todo/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE = (
  process.env.NEXT_PUBLIC_EXPRESS_URL ?? "http://localhost:4000"
).replace(/\/$/, "");
const api = (path: string) => `${API_BASE}${path}`;

export default function TodosClient({
  initialTodos,
}: {
  initialTodos: TodoTypes[];
}) {
  const [todos, setTodos] = useState<TodoTypes[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_DESC");

  async function sortTodos(id: string) {
    // TODO: finish this
  }

  async function createTodoClient(e?: React.FormEvent) {
    e?.preventDefault();
    const selectedDue = dueDate; // controlled value from DatePicker via setDueDate
    if (!title.trim()) return;

    // optimistic UI: create a temp item so user sees immediate feedback
    const temp: TodoTypes = {
      id: `temp-${Date.now()}`,
      title,
      tags,
      done: false,
      createdAt: new Date(),
      dueDate: selectedDue ? new Date(selectedDue) : undefined,
    };
    setTodos((s) => [temp, ...s]);

    try {
      const res = await fetch(api("/expressTodo"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tags,
          dueDate: selectedDue || null,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      // replace temp with server returned item
      setTodos((s) => s.map((t) => (t.id === temp.id ? created : t)));
      setTitle("");
      setTags("");
      setDueDate("");
    } catch (err) {
      // rollback on error
      setTodos((s) => s.filter((t) => t.id !== temp.id));
      console.error("Create failed", err);
    }
  }

  async function delTodo(id: string) {
    const prev = todos;
    setTodos((t) => t.filter((x) => x.id !== id));

    try {
      const res = await fetch(api(`/expressTodo/${id}`), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      setTodos(prev);
      console.error("Failed to delete", err);
    }
  }

  const toggleDone = async (id: string, done: boolean) => {
    const prev = todos;
    setTodos((t) => t.map((x) => (x.id === id ? { ...x, done } : x)));

    try {
      const res = await fetch(api(`/expressTodo/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done }),
      });
      if (!res.ok) throw new Error("Toggle failed");
    } catch (err) {
      setTodos(prev);
      console.error("Failed to toggle", err);
    }
  };

  return (
    <>
      <Card
        id="table-card"
        className={cn(
          "flex flex-col",
          "p-4",
          "w-full",
          "max-h-[70vh]",
          "overflow-hidden"
        )}
      >
        <CardHeader className="shrink-0">
          <CardTitle>TO DO LIST</CardTitle>
          <CardDescription>
            Manage, monitor and edit your schedule Displaying: ({todos.length})
            task(s)
          </CardDescription>
          <CardAction>
            <div className="grid grid-cols-[1fr_auto] text-muted-foreground items-center ">
              <div className="flex flex-row w-fit items-center gap-2">
                {/* {sortBy === "All"
                  ? "Showing "
                  : sortBy === "today"
                  ? "Showing tasks for "
                  : "Showing tasks for this "} */}

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="SortBy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt_ASC">Newest</SelectItem>
                    <SelectItem value="createdAt_DESC">Oldest</SelectItem>
                    <SelectItem value="dueDate_ASC">
                      Due date decending
                    </SelectItem>
                    <SelectItem value="dueDate_DESC">
                      Due date accending
                    </SelectItem>
                  </SelectContent>
                  {/* <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent> */}
                </Select>
              </div>
            </div>
            {/* <SortBySelect /> */}
          </CardAction>
        </CardHeader>

        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow className="text-left text-sm font-medium text-muted-foreground">
                {["Done", "Task", "Due", "Tags", "Created", ""].map((h, i) => (
                  <TableHead key={`h-${i}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y">
              {todos.map((todo) => (
                <TableRow key={todo.id} className="align-top">
                  <TableCell className="py-2 w-16">
                    <Checkbox
                      checked={!!todo.done}
                      onCheckedChange={(val) => toggleDone(todo.id, !!val)}
                    />
                  </TableCell>

                  <TableCell className="py-2 wrap-break-word min-w-50 max-w-75 ">
                    <p className="h-full w-full text-wrap">{todo.title}</p>
                  </TableCell>

                  <TableCell className="py-2 whitespace-nowrap w-24">
                    {todo.dueDate ? (
                      new Date(todo.dueDate).toLocaleDateString("nb-NO", {
                        dateStyle: "short",
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
                                tag.trim() !== "untagged" && tag.trim() !== ""
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
                          dateStyle: "short",
                        })
                      : "N/A"}
                  </TableCell>

                  <TableCell className="py-2 w-16">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Delete todo"
                      onClick={() => delTodo(todo.id)}
                    >
                      <LuX />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card id="form-card">
        <form onSubmit={createTodoClient} className="contents">
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
                  ""
                )}
              >
                Add Task
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <FieldSet className="flex gap-5 w-full">
              <Field className="flex-1 min-w-0">
                <Input
                  id="task"
                  name="title"
                  autoComplete="off"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Describe task.."
                  required
                  className={cn("min-h-10", "resize-none", "", "")}
                />
              </Field>

              <FieldGroup
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
                  ""
                )}
              >
                <Field
                  className={cn(
                    "md:w-fit",
                    "",

                    "",
                    ""
                  )}
                >
                  <DatePicker
                    id="dueDate"
                    name="dueDate"
                    value={dueDate}
                    onSelect={(v: string) => setDueDate(v)}
                  />
                </Field>
                <Field className="w-full">
                  <Input
                    id="tags"
                    name="tags"
                    type="text"
                    autoComplete="off"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add tags (separate with comma)"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </form>
      </Card>
    </>
  );
}
