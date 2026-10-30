// Types
import type { Todo } from "@/types/todo";

// Moves the todo at pageStart + fromIndex to pageStart + toIndex. Indexes are
// relative to the visible page, so todos on other pages keep their order.
export const reorderTodos = (
  todos: Todo[],
  pageStart: number,
  fromIndex: number,
  toIndex: number,
): Todo[] => {
  const from = pageStart + fromIndex;
  const to = pageStart + toIndex;

  const isOutOfRange =
    fromIndex < 0 || toIndex < 0 || from >= todos.length || to >= todos.length;

  if (isOutOfRange || from === to) {
    return todos;
  }

  const next = [...todos];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);

  return next;
};
