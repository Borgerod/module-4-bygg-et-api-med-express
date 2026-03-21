import { FILTER } from "@lib/formConfig";
import { TodoType } from "@types";

const normalizeTags = (tags?: TodoType["tags"]): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const matchesIncludeTags = (todo: TodoType, includeTags: string[]): boolean => {
  if (includeTags.length === 0) return true;
  const todoTags = normalizeTags(todo.tags).map((tag) => tag.toLowerCase());
  return includeTags.every((tag) => todoTags.includes(tag.toLowerCase()));
};

export const toggleFilters = (
  array: Array<TodoType>,
  selectedPeriod: string,
  isDone: string,
  includeTags: string[],
) => {
  let result = array;

  switch (isDone) {
    case FILTER.done.active:
      result = result.filter((item) => !item.done);
      break;
    case FILTER.done.completed:
      result = result.filter((item) => item.done);
      break;
    default:
    case FILTER.done.all:
      result = result;
      break;
  }

  const getRange = (start: Date, days: number) => {
    const end = new Date(start.getTime() + days * 86_400_000 - 1);
    return { start: start.getTime(), end: end.getTime() };
  };

  const inRange = (item: TodoType, start: number, end: number) => {
    const time = item.dueDate ? new Date(item.dueDate).getTime() : NaN;
    return time >= start && time <= end;
  };

  switch (selectedPeriod) {
    case FILTER.period.today: {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter(
        (item) =>
          item.dueDate &&
          new Date(item.dueDate).setHours(0, 0, 0, 0) === today.getTime(),
      );
      break;
    }

    case FILTER.period.tomorrow: {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter(
        (item) =>
          item.dueDate &&
          new Date(item.dueDate).setHours(0, 0, 0, 0) ===
            today.getTime() + 86_400_000,
      );
      break;
    }

    case FILTER.period.thisWeek: {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      const { start: s, end: e } = getRange(start, 7);
      result = result.filter((item) => inRange(item, s, e));
      break;
    }

    case FILTER.period.nextWeek: {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + 7);
      start.setHours(0, 0, 0, 0);
      const { start: s, end: e } = getRange(start, 7);
      result = result.filter((item) => inRange(item, s, e));
      break;
    }

    case FILTER.period.thisMonth: {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      result = result.filter((item) =>
        inRange(item, start.getTime(), end.getTime()),
      );
      break;
    }

    case FILTER.period.nextMonth: {
      const start = new Date();
      start.setMonth(start.getMonth() + 1);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      result = result.filter((item) =>
        inRange(item, start.getTime(), end.getTime()),
      );
      break;
    }

    default:
      result = result;
      break;
  }

  if (includeTags.length > 0) {
    result = result.filter((todo) => matchesIncludeTags(todo, includeTags));
  }

  return result;
};
