import { create } from "zustand";

// Types
import type { Todo } from "@/types/todo";

import { createTodo } from "./create-todo";

export interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
}

export const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
  addTodo: (title) =>
    set((state) => ({ todos: [createTodo(title), ...state.todos] })),
}));
