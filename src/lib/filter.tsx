// import { FILTER, SORT_ORDERS } from "@/filterConfig.js";
import { FILTER, SORT_ORDERS } from "@lib/formConfig";
import { TodoType } from "@lib/types";
/* 
	NOTE: 
	Params in this file breaks a '@CleanCode' rule - never pass a whole dataset/array as a param. 
	It needlessly increases runtime and memory efficiancy by creating a "data stream detour", 
	the current structure is a dataflow bottleneck.
*/
/*
    the type can be decleared as "Array<TodoType>," or "TodoType[]"
*/

export const toggleFilters = (
  array: Array<TodoType>,
  //   filterValue: string,
  //   setSelectPeriod: React.Dispatch<React.SetStateAction<string>>,
  selectedPeriod: string,
  isDone: string,
) => {
  const filtered = [...array];
  let result: TodoType[];
  //   setSelectPeriod(filterValue);
  switch (isDone) {
    case FILTER.done.active:
      result = array.filter((item) => !item.done);
      break;
    case FILTER.done.completed:
      result = array.filter((item) => item.done);
      break;
    default:
    case FILTER.done.all:
      result = array;
      break;
  }

  const getRange = (start: Date, days: number) => {
    const end = new Date(start.getTime() + days * 86_400_000 - 1);
    return { start: start.getTime(), end: end.getTime() };
  };

  const inRange = (item: TodoType, start: number, end: number) => {
    const time = new Date(item.dueDate).getTime();
    return time >= start && time <= end;
  };

  switch (selectedPeriod) {
    case FILTER.period.today:
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = array.filter(
        (item) =>
          new Date(item.dueDate).setHours(0, 0, 0, 0) === today.getTime(),
      );
      break;

    case FILTER.period.tomorrow:
      result = array.filter(
        (item) =>
          new Date(item.dueDate).setHours(0, 0, 0, 0) ===
          today.getTime() + 86_400_000,
      );
      break;

    case FILTER.period.thisWeek: {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      const { start: s, end: e } = getRange(start, 7);
      result = array.filter((item) => inRange(item, s, e));
      break;
    }

    case FILTER.period.nextWeek: {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + 7);
      start.setHours(0, 0, 0, 0);
      const { start: s, end: e } = getRange(start, 7);
      result = array.filter((item) => inRange(item, s, e));
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
      result = array.filter((item) =>
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
      result = array.filter((item) =>
        inRange(item, start.getTime(), end.getTime()),
      );
      break;
    }

    default:
      break;
  }
  return result;
};

/*
    This is a blank date handler. will set it to this instead of having to handle a undefined value. 
    The UI will instead translate this date to a blank.
 */
const DEFAULT_DATE = "3000-01-01T00:00:00Z";

const sortNewest = (column: string, array: TodoType[]) => {
  // ASC
  // (new-old)
  return [...array].sort((a, b) =>
    column === "dueDate" // else column ==="createdAt"
      ? getTime(a.dueDate ?? DEFAULT_DATE) - getTime(b.dueDate ?? DEFAULT_DATE)
      : getTime(a.createdAt ?? DEFAULT_DATE) -
        getTime(b.createdAt ?? DEFAULT_DATE),
  );
};

const sortOldest = (column: string, array: TodoType[]) => {
  // DESC
  // (old-new)
  return [...array].sort((a, b) =>
    column === "dueDate" // else column ==="createdAt"
      ? getTime(b.dueDate ?? DEFAULT_DATE) - getTime(a.dueDate ?? DEFAULT_DATE)
      : getTime(b.createdAt ?? DEFAULT_DATE) -
        getTime(a.createdAt ?? DEFAULT_DATE),
  );
};

const sortAZ = (array: TodoType[]) => {
  // ASC
  // (A-Z)
  return [...array].sort((a, b) => a.title.localeCompare(b.title));
};

const sortZA = (array: TodoType[]) => {
  // DESC
  // (Z-A)
  return [...array].sort((a, b) => b.title.localeCompare(a.title));
};

function getTime(date?: Date | string): number {
  if (!date) return 0;
  return new Date(date).getTime();
}

export async function sortTodos(
  sortOrderValue: string,
  todos: TodoType[],
  setSortBy: React.Dispatch<React.SetStateAction<string>>,
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>,
) {
  setSortBy(sortOrderValue);
  const sorted = [...todos];
  let result: TodoType[];
  switch (sortOrderValue) {
    case SORT_ORDERS.az:
      result = sortAZ(sorted); // (A-Z)
      break;
    case SORT_ORDERS.za:
      result = sortZA(sorted); // (Z-A)
      break;
    case SORT_ORDERS.duedate_asc: // (new-old)
      result = sortNewest("dueDate", sorted);
      break;
    case SORT_ORDERS.createdat_asc: // (new-old)
      result = sortNewest("createdAt", sorted);
      break;
    case SORT_ORDERS.duedate_desc: // (old-new)
      result = sortOldest("dueDate", sorted);
      break;
    case SORT_ORDERS.createdat_desc: // (old-new)
    default:
      result = sortOldest("createdAt", sorted);
      break;
  }
  setTodos(result);
  return result;
}
