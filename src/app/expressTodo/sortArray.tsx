import { SORT_ORDERS } from "@lib/formConfig";
import { TodoType } from "@types";

const DEFAULT_DATE = "3000-01-01T00:00:00Z";

const sortNewest = (column: string, array: TodoType[]) => {
  // ASC
  // (new-old)
  return [...array].sort((a, b) =>
    column === "dueDate"
      ? getTime(a.dueDate ?? DEFAULT_DATE) - getTime(b.dueDate ?? DEFAULT_DATE)
      : getTime(a.createdAt ?? DEFAULT_DATE) -
        getTime(b.createdAt ?? DEFAULT_DATE)
  );
};

const sortOldest = (column: string, array: TodoType[]) => {
  // DESC
  // (old-new)
  return [...array].sort((a, b) =>
    column === "dueDate"
      ? getTime(b.dueDate ?? DEFAULT_DATE) - getTime(a.dueDate ?? DEFAULT_DATE)
      : getTime(b.createdAt ?? DEFAULT_DATE) -
        getTime(a.createdAt ?? DEFAULT_DATE)
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

// export async function sortArray(
//   sortOrderValue: string,
//   todos: TodoType[]
// ): Promise<TodoType[]> {
export function sortArray(
  sortOrderValue: string,
  todos: TodoType[]
): TodoType[] {
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
  return result;
}
