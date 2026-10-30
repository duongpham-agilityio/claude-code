import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Types
import type { Todo } from "@/types/todo";

import { createTodo } from "./create-todo";
import { removeTodo } from "./remove-todo";
import { reorderTodos } from "./reorder-todo";
import { toggleTodoDone } from "./toggle-todo";
import { updateTodoTitle } from "./update-todo";

export interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
  updateTodo: (id: Todo["id"], title: Todo["title"]) => void;
  removeTodo: (id: Todo["id"]) => void;
  toggleTodo: (id: Todo["id"], done: boolean) => void;
  reorderTodo: (pageStart: number, fromIndex: number, toIndex: number) => void;
}

export const TODO_STORAGE_KEY = "todo-store";

const isTodo = (value: unknown): value is Todo => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.done === "boolean"
  );
};

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (title) =>
        set((state) => ({ todos: [createTodo(title), ...state.todos] })),
      updateTodo: (id, title) =>
        set((state) => ({ todos: updateTodoTitle(state.todos, id, title) })),
      removeTodo: (id) =>
        set((state) => ({ todos: removeTodo(state.todos, id) })),
      toggleTodo: (id, done) =>
        set((state) => ({ todos: toggleTodoDone(state.todos, id, done) })),
      reorderTodo: (pageStart, fromIndex, toIndex) =>
        set((state) => ({
          todos: reorderTodos(state.todos, pageStart, fromIndex, toIndex),
        })),
    }),
    {
      name: TODO_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ todos: state.todos }),
      merge: (persisted, current) => {
        const todos = (persisted as { todos?: unknown } | undefined)?.todos;

        if (!Array.isArray(todos)) {
          return current;
        }

        return { ...current, todos: todos.filter(isTodo) };
      },
    },
  ),
);
