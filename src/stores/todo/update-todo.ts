// Types
import type { Todo } from "@/types/todo";

export const updateTodoTitle = (
  todos: Todo[],
  id: Todo["id"],
  title: string,
): Todo[] => {
  const trimmed = title.trim();

  return todos.map((todo) =>
    todo.id === id ? { ...todo, title: trimmed } : todo,
  );
};
