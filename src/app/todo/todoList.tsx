import { TodoType } from "@types";
import { TodoItem } from "./TodoItem";
import { getTodos } from "@lib/todo";

type Filter = {
  period?: string;
};

type SearchParams = {
  sort?: string;
  query?: string;
  filter?: Filter;
};

export default async function TodoList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const period =
    typeof params.period === "string"
      ? params.period
      : Array.isArray(params.period)
        ? params.period[0]
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

  return filteredTodos.map((todo, i) => <TodoItem key={i} {...todo} />);
}
