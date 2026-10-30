// Types
import type { Todo } from "@/types/todo";

// Moves the todo at `pageStart + fromIndex` to `pageStart + toIndex`, so indexes
// are relative to the visible page while the whole `todos` array is returned.
export const reorderTodos = (
  todos: Todo[],
  pageStart: number,
  fromIndex: number,
  toIndex: number,
): Todo[] => {
  const from = pageStart + fromIndex;
  const to = pageStart + toIndex;
  const inRange = (index: number): boolean =>
    Number.isInteger(index) && index >= 0 && index < todos.length;

  if (from === to || !inRange(from) || !inRange(to)) {
    return todos;
  }

  const next = [...todos];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);

  return next;
};
