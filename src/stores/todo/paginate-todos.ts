// Constants
import { TODO_PAGE_SIZE } from "@/constants";

// Types
import type { Todo } from "@/types/todo";

export interface PaginatedTodos {
  pagedTodos: Todo[];
  currentPage: number;
  totalPages: number;
}

export const getTotalPages = (todoCount: number): number =>
  Math.max(1, Math.ceil(todoCount / TODO_PAGE_SIZE));

export const clampPage = (page: number, todoCount: number): number =>
  Math.min(Math.max(1, Math.trunc(page) || 1), getTotalPages(todoCount));

export const paginateTodos = (todos: Todo[], page: number): PaginatedTodos => {
  const totalPages = getTotalPages(todos.length);
  const currentPage = clampPage(page, todos.length);
  const start = (currentPage - 1) * TODO_PAGE_SIZE;

  return {
    pagedTodos: todos.slice(start, start + TODO_PAGE_SIZE),
    currentPage,
    totalPages,
  };
};
