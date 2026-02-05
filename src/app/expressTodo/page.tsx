"use client";
import { TodoProvider } from "./TodoContext";
import TodoFilters, { FilterType } from "./TodoFilters";
import { useEffect, useState } from "react";
import { Todo } from "@types";
import TodoUtils from "@lib/TodoUtils";
import { toggleFilters } from "@lib/filter";
import TodoList from "./TodoList";
import TodoInput from "./TodoInput";
import { FILTER, SORT_ORDERS } from "@lib/formConfig";
import { sortArray } from "./sortArray";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

// TODO: checkbox not working
async function getTodos(): Promise<Todo[]> {
  const expressUrl =
    process.env.NEXT_PUBLIC_EXPRESS_URL ?? "http://localhost:4000";
  const url = expressUrl
    ? `${expressUrl.replace(/\/$/, "")}/expressTodo`
    : "/expressTodo";
  const res = await fetch(url, { cache: "no-store", credentials: "include" });
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      // window.location.replace("/login");
      // redirect("/login");
      redirect(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
    }
    return [];
  }
  const data = await res.json();
  return data.data || data;
}

export default function Page() {
  const selectPeriod = FILTER.period.all;

  const [filter, setFilter] = useState<FilterType>({
    sortBy: "",
    selectPeriod: "",
    isDone: "",
    includeTags: [],
  });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState(SORT_ORDERS.createdat_asc);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getTodos().then((data) => {
      setTodos(data);
      setIsLoading(false);
    });
  }, []);

  const { addTask, deleteTask, toggleComplete, editTask } = TodoUtils(
    todos,
    setTodos,
  );

  if (isLoading) {
    return <div className={cn("", "", "")}>Loading...</div>;
  }
  return (
    <TodoProvider todos={todos}>
      <div className={cn("space-y-4 flex flex-col", "", "")}>
        <TodoInput onAdd={addTask} />

        <Card
          id="table-card"
          className={cn(
            "flex flex-col",
            "p-4",
            "w-full",
            "overflow-hidden",
            "",
            "",
          )}
        >
          <CardHeader className="w-full px-0">
            <CardTitle>TO DO LIST</CardTitle>
            <CardDescription>
              Manage, monitor and edit your schedule Displaying: ({todos.length}
              ) task(s)
            </CardDescription>
            <CardAction>
              <div
                className={cn(
                  "flex flex-col items-end text-muted-foreground text-end",
                  "gap-2",
                  "py-2",
                  "",
                  "",
                )}
              >
                <div className="text-nowrap  gap-1 text-sm flex flex-row">
                  {/* Showing */}
                  <h2
                    className={cn(
                      "text-3xl uppercase",
                      "leading-4",
                      "text-primary",
                      "",
                      "",
                    )}
                  >
                    {selectPeriod}
                  </h2>
                </div>
              </div>
            </CardAction>
          </CardHeader>
          <div
            id="listconfig-section filter sort "
            className="flex flex-row w-full justify-between items-center gap-2 "
          >
            <TodoFilters {...{ filter, setFilter, sortBy, setSortBy }} />
            <div
              id="sortby-select"
              className="flex flex-row w-fit items-center gap-2 text-sm"
            >
              Sort by
              <Select
                value={sortBy}
                onValueChange={(value: string) => {
                  setSortBy(value);
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder={sortBy} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SORT_ORDERS).map((label) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardContent>
            <TodoList
              todos={sortArray(
                sortBy,
                toggleFilters(
                  todos,
                  filter.selectPeriod,
                  filter.isDone,
                  filter.includeTags,
                ),
              )}
              onDelete={deleteTask}
              onToggle={toggleComplete}
              onEdit={editTask}
              setTodos={setTodos}
            />
          </CardContent>
        </Card>
      </div>
    </TodoProvider>
  );
}
