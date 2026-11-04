// Types
import type { Todo } from "@/types/todo";

// Moves a todo inside the visible page. Indexes are relative to the page slice,
// `pageStart` is the index of the page's first todo in the full list.
export const reorderTodos = (
  todos: Todo[],
  pageStart: number,
  fromIndex: number,
  toIndex: number,
): Todo[] => {
  const from = pageStart + fromIndex;
  const to = pageStart + toIndex;
  const isOutOfRange = (index: number) => index < 0 || index >= todos.length;

  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    isOutOfRange(from) ||
    isOutOfRange(to) ||
    from === to
  ) {
    return [...todos];
  }

  const next = [...todos];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);

  return next;
};
