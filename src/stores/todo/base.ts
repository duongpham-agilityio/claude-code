import { create } from "zustand";

// Types
import type { Todo } from "@/types/todo";

export interface TodoState {
  todos: Todo[];
}

export const useTodoStore = create<TodoState>()(() => ({
  todos: [],
}));
