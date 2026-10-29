import { create } from "zustand";

// Types
import type { Todo } from "@/types/todo";

import { createTodo } from "./create-todo";
import { removeTodo } from "./remove-todo";
import { toggleTodoDone } from "./toggle-todo";
import { updateTodoTitle } from "./update-todo";

export interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
  updateTodo: (id: Todo["id"], title: Todo["title"]) => void;
  removeTodo: (id: Todo["id"]) => void;
  toggleTodo: (id: Todo["id"], done: boolean) => void;
}

export const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
  addTodo: (title) =>
    set((state) => ({ todos: [createTodo(title), ...state.todos] })),
  updateTodo: (id, title) =>
    set((state) => ({ todos: updateTodoTitle(state.todos, id, title) })),
  removeTodo: (id) =>
    set((state) => ({ todos: removeTodo(state.todos, id) })),
  toggleTodo: (id, done) =>
    set((state) => ({ todos: toggleTodoDone(state.todos, id, done) })),
}));
