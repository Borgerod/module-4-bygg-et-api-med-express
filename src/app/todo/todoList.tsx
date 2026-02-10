import { TodoType } from "@types";
import { TodoItem } from "./TodoItem";
import { getTodos } from "@lib/todo";

type Filter = {
  period: string;
};

export default async function TodoList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page = "1", sort = "dueDate,asc", query = "" } = await searchParams;

  const filters = await searchParams;
  const period =
    typeof filters.period === "string"
      ? filters.period
      : Array.isArray(filters.period)
        ? filters.period[0]
        : undefined;
  const todos = await getTodos();

  function filterByPeriod(todos: TodoType[], period: string | undefined) {
    if (!todos[0]?.dueDate) {
      return [];
    }
    switch (period) {
      case "today":
        return todos.filter(
          (todo: TodoType) =>
            todo.dueDate !== null &&
            todo.dueDate.getDate() == new Date().getDate(),
        );
      case "tomorrow":
        return todos.filter(
          (todo: TodoType) =>
            todo.dueDate !== null &&
            todo.dueDate.getDate() == new Date().getDate() + 1,
        );
      case "this_week":
        return todos.filter(
          (todo: TodoType) =>
            todo.dueDate !== null &&
            todo.dueDate.getDate() >= new Date().getDate() &&
            todo.dueDate.getDate() <= new Date().getDate() + 7,
        );
      case "next_week":
        return todos.filter(
          (todo: TodoType) =>
            todo.dueDate !== null &&
            todo.dueDate.getDate() >= new Date().getDate() + 7 &&
            todo.dueDate.getDate() <= new Date().getDate() + 14,
        );
      case "this_month":
        return todos.filter(
          (todo: TodoType) =>
            todo.dueDate !== null &&
            todo.dueDate.getMonth() == new Date().getMonth(),
        );
      case "next_month":
        return todos.filter(
          (todo: TodoType) =>
            todo.dueDate !== null &&
            todo.dueDate.getMonth() == new Date().getMonth() + 1,
        );
      case "all":
      default:
        return todos;
    }
  }
  const filteredTodos: TodoType[] = filterByPeriod(todos, period);

  function sortBy(todos: TodoType[], sortString: string) {
    const [fieldName, order] = sortString.split(",").map((s) => s.trim());

    const field = fieldName as keyof TodoType;

    switch (order) {
      case "asc":
        return [...todos].sort(
          (a, b) =>
            new Date(a[field] as string).getTime() -
            new Date(b[field] as string).getTime(),
        );

      case "desc":
        return [...todos].sort(
          (a, b) =>
            new Date(b[field] as string).getTime() -
            new Date(a[field] as string).getTime(),
        );

      case "az":
        return [...todos].sort((a, b) =>
          (a[field] as string).localeCompare(b[field] as string),
        );

      case "za":
        return [...todos].sort((a, b) =>
          (b[field] as string).localeCompare(a[field] as string),
        );

      default:
        return todos;
    }
  }

  const sortedTodos = sortBy(filteredTodos, sort as string);

  return sortedTodos?.map((todo, i) => <TodoItem key={i} {...todo} />) ?? [];
}
