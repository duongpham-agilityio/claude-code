// Types
import type { Todo } from "@/types/todo";

export const toggleTodoDone = (
  todos: Todo[],
  id: Todo["id"],
  done: boolean,
): Todo[] => todos.map((todo) => (todo.id === id ? { ...todo, done } : todo));
