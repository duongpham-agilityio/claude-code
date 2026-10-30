// Constants
import { TODO_PAGE_SIZE } from "@/constants";

// Types
import type { Todo } from "@/types/todo";

// `fromIndex` and `toIndex` are relative to the page; `pageStart` is the index
// in `todos` of the first item on that page.
export const reorderTodos = (
  todos: Todo[],
  pageStart: number,
  fromIndex: number,
  toIndex: number,
): Todo[] => {
  const pageLength = Math.min(TODO_PAGE_SIZE, todos.length - pageStart);
  const isInRange = (index: number) =>
    Number.isInteger(index) && index >= 0 && index < pageLength;

  if (fromIndex === toIndex || !isInRange(fromIndex) || !isInRange(toIndex)) {
    return todos;
  }

  const next = [...todos];
  const [moved] = next.splice(pageStart + fromIndex, 1);
  next.splice(pageStart + toIndex, 0, moved);

  return next;
};
