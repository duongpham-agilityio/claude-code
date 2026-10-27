// Types
import type { Todo } from "@/types/todo";

export const createTodo = (title: string): Todo => {
  const trimmed = title.trim();

  if (!trimmed) {
    throw new Error("Title is required");
  }

  return { id: crypto.randomUUID(), title: trimmed, done: false };
};
