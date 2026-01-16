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
import { HiOutlineAdjustments, HiOutlinePlusSm } from "react-icons/hi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuX } from "react-icons/lu";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@lib/utils";

import { DatePicker } from "@/components/ui/todo/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PeriodSelect from "../todo/PeriodSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [selectPeriod, setSelectPeriod] = useState("all");

  // const [sortCol, sortDir] = sortBy.split("_");
  // const sorted = [...todos].sort((a_val, b_val) => {
  //   const aRaw = a_val[sortCol as keyof TodoTypes];
  //   const bRaw = b_val[sortCol as keyof TodoTypes];

  //   // Custom logic: always push empty due dates to the bottom
  //   if (!aRaw && !bRaw) return 0;
  //   if (!aRaw) return 1;
  //   if (!bRaw) return -1;

  //   const a = String(aRaw);
  //   const b = String(bRaw);

  //   if (a + b > b + a) return sortDir === "ASC" ? 1 : -1;
  //   else if (a + b < b + a) return sortDir === "ASC" ? -1 : 1;
  //   else return 0;
  // });

  async function handleSelectPeriod(value: string) {
    setSelectPeriod(value);
  }

  function getTime(date?: Date | string): number {
    if (!date) return 0;
    return new Date(date).getTime();
  }

  async function sortTodos(value: string) {
    setSortBy(value);
    const sorted = [...todos];

    switch (value) {
      case "dueDate_ASC": {
        const result = sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return getTime(a.dueDate) - getTime(b.dueDate);
        });
        setTodos(result);
        return result;
      }
      case "dueDate_DESC": {
        const result = sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return getTime(b.dueDate) - getTime(a.dueDate);
        });
        setTodos(result);
        return result;
      }
      case "createdAt_ASC": {
        const result = sorted.sort(
          (a, b) => getTime(a.createdAt) - getTime(b.createdAt)
        );
        setTodos(result);
        return result;
      }
      case "createdAt_DESC":
      default: {
        const result = sorted.sort(
          (a, b) => getTime(b.createdAt) - getTime(a.createdAt)
        );
        setTodos(result);
        return result;
      }
    }
  }
  //   async function largestNumber(todos: TodoTypes[], sortBy: string) {
  //   const sorted = [...todos].sort((a_val, b_val) => {
  //     const a = a_val.createdAt ? new Date(a_val.createdAt).getTime() : 0;
  //     const b = b_val.createdAt ? new Date(b_val.createdAt).getTime() : 0;
  //     if (a > b) return -1;
  //     else if (a < b) return 1;
  //     else return 0;
  //   });
  //   return sorted;
  // }

  // async function sortTodos(value: string) {
  //   // sortBy: string,
  //   // id: string,
  //   // formData: FormData //this so we can apply sortby to formdata so sort is maintained while when form is changed. (prob redundatn)
  //   // Try: handle internal (no api calls)
  //   // "use server";
  //   // const id = formData.get("id") as string;
  //   // let sortCol: string;
  //   // switch (sortBy) {
  //   //   case "dueDate_DESC":
  //   //     sortCol = "dueDate";
  //   //     break;
  //   //   case "dueDate_ASC":
  //   //     sortCol = "dueDate";
  //   //     break;
  //   //   case "createdAt_DESC":
  //   //     sortCol = "createdAt";
  //   //     break;
  //   //   case "createdAt_ASC":
  //   //   default:
  //   //     sortCol = "createdAt";
  //   //     break;
  //   //   }

  //   // sorting algo
  //   // sortCol = "dueDate"; //exampledata
  //   // soretBy = "dueDate_DESC"; //exampledata
  //   // Greedy

  //   console.log("before (sortby): ", sortBy);
  //   console.log("before (value): ", value);
  //   console.log("before (todos): ", todos);
  //   setSortBy(value);
  //   console.log("after (sortby): ", sortBy);
  //   console.log("after (value): ", value);
  //   const newToDos = await largestNumber(todos, value);
  //   if (Array.isArray(newToDos)) {
  //     setTodos(newToDos);
  //     console.log("after (todos): ", newToDos);
  //   } else {
  //     console.log("error, did not get sorted");
  //   }
  // }

  async function createTodoClient(e?: React.FormEvent) {
    e?.preventDefault();
    const selectedDue = dueDate; // controlled value from DatePicker via setDueDate
    if (!title.trim()) return;

    // optimistic UI: create a temp item so user sees immediate feedback
    // ? should probably use a type schema
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
          "overflow-hidden",
          "",
          ""
        )}
      >
        {/* <CardHeader className="shrink-0"> */}
        <CardHeader className="w-full px-0">
          <CardTitle>TO DO LIST</CardTitle>
          <CardDescription>
            Manage, monitor and edit your schedule Displaying: ({todos.length})
            task(s)
          </CardDescription>
          <CardAction>
            {/* <div className="grid grid-cols-[1fr_auto] text-muted-foreground items-center grid-rows-3 "> */}
            <div
              className={cn(
                "flex flex-col items-end text-muted-foreground text-end",
                "gap-2",
                "py-2",
                "",
                ""
              )}
            >
              <div className="text-nowrap  gap-1 text-sm flex flex-row">
                Showing
                <h2
                  className={cn(
                    "text-2xl uppercase",

                    "leading-4",
                    "text-primary",
                    "",
                    ""
                  )}
                >
                  {selectPeriod}
                </h2>
              </div>

              {/* <div className="text-nowrap flex gap-1 text-sm leading-9 ">
                {selectPeriod === "all" ? (
                  <>
                    Showing <h2 className="text-2xl">{selectPeriod}</h2> tasks
                  </>
                ) : (
                  <>
                    Showing <h2 className="text-2xl">{selectPeriod}&#39;s</h2>{" "}
                    tasks
                  </>
                )}
              </div> */}

              {/* <div className="text-nowrap gap-1 text-sm flex flex-row items-center invert">
                Select period
                <Card className="relative grid px-2  h-fit w-50 bg-background">
                  <h2
                    className={cn(
                      "text-2xl uppercase leading-2 place-self-center pointer-events-none text-primary",
                      "",
                      ""
                    )}
                  >
                    {selectPeriod}
                  </h2>
                  <Select
                    value={selectPeriod}
                    onValueChange={handleSelectPeriod}
                  >
                    <SelectTrigger
                      className={cn(
                        "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
                        "place-self-center",
                        "",
                        ""
                      )}
                      style={{ zIndex: 10 }}
                    >
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="this week">This week</SelectItem>
                      <SelectItem value="next week">Next week</SelectItem>
                      <SelectItem value="this month">This month</SelectItem>
                      <SelectItem value="next month">Next month</SelectItem>
                    </SelectContent>
                  </Select>
                </Card>
              </div> */}

              {/* <div className="flex flex-row w-fit items-center gap-2">
                Select period
                <Select value={selectPeriod} onValueChange={handleSelectPeriod}>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="SortBy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="this week">This week</SelectItem>
                    <SelectItem value="next week">Next week</SelectItem>
                    <SelectItem value="this month">This month</SelectItem>
                    <SelectItem value="next month">Next month</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
            {/* </div> */}
          </CardAction>
        </CardHeader>

        <div className="overflow-auto flex-1">
          <div id="table-settings-row">
            <div id="open-filter-button ">
              <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              {/* <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Open Filter"
                  >
                    <HiOutlineAdjustments />
                  </Button>
                </PopoverTrigger>
                <PopoverContent asChild className="">
                  <form

                  //  onSubmit={filterTodos}
                  >
                    <Field>
                      <FieldLabel>Select period</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose department" />
                        </SelectTrigger>
                        <SelectContent className="contents absolute top-0">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="this week">This week</SelectItem>
                          <SelectItem value="next week">Next week</SelectItem>
                          <SelectItem value="this month">This month</SelectItem>
                          <SelectItem value="next month">Next month</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Select for what period you want to display the tasks,
                        e.g.: only show todays tasks, etc...
                      </FieldDescription>
                    </Field>
                  </form>
                </PopoverContent>
              </Popover> */}
            </div>

            <div
              id="sortby-select"
              className="flex flex-row w-fit items-center gap-2 "
            >
              Sort by
              <Select value={sortBy} onValueChange={sortTodos}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="SortBy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt_ASC">Oldest</SelectItem>
                  <SelectItem value="createdAt_DESC">Newest</SelectItem>
                  <SelectItem value="dueDate_ASC">Earliest due</SelectItem>
                  <SelectItem value="dueDate_DESC">Latest due</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                    <span
                      className={cn(
                        "",
                        {
                          "text-primary":
                            !todo.dueDate ||
                            new Date(todo.dueDate) > new Date(),
                          "text-warning":
                            todo.dueDate &&
                            new Date(todo.dueDate) <= new Date(),
                        },
                        "",
                        ""
                      )}
                    >
                      {todo.dueDate
                        ? new Date(todo.dueDate).toLocaleDateString("nb-NO", {
                            dateStyle: "medium",
                          })
                        : "-"}
                    </span>
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
                          dateStyle: "medium",
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
                  "flex items-center justify-center text-center place-items-center",
                  "data-[empty=true]:text-muted-foreground font-normal",
                  "text-3xl text-muted-foreground",
                  "",
                  ""
                )}
              >
                <HiOutlinePlusSm />
                {/* Add Task */}
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
