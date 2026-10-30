import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Types
import type { Todo } from "@/types/todo";

import { createTodo } from "./create-todo";
import { clampPage } from "./paginate-todos";
import { removeTodo } from "./remove-todo";
import { toggleTodoDone } from "./toggle-todo";
import { updateTodoTitle } from "./update-todo";

export interface TodoState {
  todos: Todo[];
  currentPage: number;
  setPage: (page: number) => void;
  addTodo: (title: string) => void;
  updateTodo: (id: Todo["id"], title: Todo["title"]) => void;
  removeTodo: (id: Todo["id"]) => void;
  toggleTodo: (id: Todo["id"], done: boolean) => void;
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
      currentPage: 1,
      setPage: (page) =>
        set((state) => ({ currentPage: clampPage(page, state.todos.length) })),
      addTodo: (title) =>
        set((state) => ({
          todos: [createTodo(title), ...state.todos],
          currentPage: 1,
        })),
      updateTodo: (id, title) =>
        set((state) => ({ todos: updateTodoTitle(state.todos, id, title) })),
      removeTodo: (id) =>
        set((state) => {
          const todos = removeTodo(state.todos, id);

          return {
            todos,
            currentPage: clampPage(state.currentPage, todos.length),
          };
        }),
      toggleTodo: (id, done) =>
        set((state) => ({ todos: toggleTodoDone(state.todos, id, done) })),
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
