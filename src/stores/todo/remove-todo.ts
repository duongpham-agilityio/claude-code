// Types
import type { Todo } from "@/types/todo";

export const REMOVE_TODO_ERROR_MESSAGE =
  "Could not delete the todo. Please try again.";

export const removeTodo = (todos: Todo[], id: Todo["id"]): Todo[] => {
  const remaining = todos.filter((todo) => todo.id !== id);

  if (remaining.length === todos.length) {
    throw new Error(REMOVE_TODO_ERROR_MESSAGE);
  }

  return remaining;
};
