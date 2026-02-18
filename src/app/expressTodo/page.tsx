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
import { BsInfoLg } from "react-icons/bs";
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

async function getTodos(): Promise<Todo[]> {
  const expressUrl =
    process.env.NEXT_PUBLIC_EXPRESS_URL ?? "http://localhost:4000";
  const url = expressUrl
    ? `${expressUrl.replace(/\/$/, "")}/expressTodo`
    : "/expressTodo";

  const res = await fetch(url, { cache: "no-store", credentials: "include" });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.assign(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
    }
    return [];
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.status}`);
  }

  const data: unknown = await res.json();
  const parsed = data as { data?: Todo[] } | Todo[];

  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (Array.isArray(parsed.data)) {
    return parsed.data;
  }
  return [];
}

export default function Page() {
  const selectPeriod = FILTER.period.all;

  const [filter, setFilter] = useState<FilterType>({
    selectPeriod: "",
    isDone: FILTER.done.active,
    includeTags: [],
  });

  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState(SORT_ORDERS.duedate_asc);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const loadTodos = async () => {
      try {
        const data = await getTodos();
        if (mounted) {
          setTodos(data);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTodos();

    return () => {
      mounted = false;
    };
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
      <div className={cn("space-y-4 flex flex-col", "my-auto", "", "")}>
        <TodoInput onAdd={addTask} />

        <Card
          id="table-card"
          className={cn("flex flex-col", "p-4", "w-full", "", "")}
        >
          <CardHeader className="w-full px-0">
            <CardTitle>TO DO LIST</CardTitle>
            <CardDescription>
              Manage, monitor and edit your schedule Displaying: ({todos.length}
              ) task(s)
            </CardDescription>
            <CardAction>
              <h2 className={cn("text-3xl uppercase", "", "")}>
                {selectPeriod}
              </h2>
            </CardAction>
          </CardHeader>
          <div
            id="listconfig-section filter sort "
            className="flex flex-row w-full justify-between items-center gap-2 "
          >
            <TodoFilters
              id="filter filter-button filter-component"
              {...{
                filter,
                setFilter,
              }}
            />
            <Button
              id="reset-filter reset button"
              type="reset"
              variant="outline"
              className={cn("ml-2", "font-normal", "")}
              onClick={() =>
                setFilter({
                  selectPeriod: "",
                  isDone: FILTER.done.active,
                  includeTags: [],
                })
              }
            >
              Reset filters
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  // NB: NOT a button - I use this button only for the styling, it has no function to it.
                  id="tooltip info information instructions not-in-use"
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Delete todo"
                  className="mr-auto text-muted-foreground"
                >
                  <BsInfoLg />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="p-4">
                color coding:
                <ul className="flex flex-col gap-1 px-2">
                  <li>
                    {" "}
                    -{" "}
                    <span className="text-[oklch(0.704_0.191_22.216)]">
                      red due dates
                    </span>{" "}
                    means that it is over due (will also contain a red overdue
                    tag)
                  </li>
                  <li>
                    {" "}
                    -{" "}
                    <span className="text-[oklch(0.8_0.15_145)]">
                      green due dates
                    </span>{" "}
                    means that it is due today
                  </li>
                  <li>
                    {" "}
                    - <span className="font-semibold">today&#39;s tasks </span>
                    will also uses a stronger font{" "}
                  </li>
                </ul>
                Special tags:
                <ul className="flex flex-col gap-1 px-2">
                  <li>
                    {" "}
                    - overdue tags will contain:{" "}
                    <Badge className="bg-[oklch(0.704_0.191_22.216)] text-primary">
                      overdue
                    </Badge>
                  </li>
                  <li>
                    {" "}
                    - urgent tasks will contain a yellow{" "}
                    <Badge className="bg-[oklch(0.85_0.12_87.98)] text-primary">
                      urgent
                    </Badge>
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>

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
                <SelectContent position="popper">
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
              filter={filter}
              setFilter={setFilter}
            />
          </CardContent>
        </Card>
      </div>
    </TodoProvider>
  );
}
