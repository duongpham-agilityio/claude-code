// Types
import type { Todo } from "@/types/todo";

export interface PaginatedTodos {
  items: Todo[];
  page: number;
  totalPages: number;
}

const getTotalPages = (total: number, size: number): number =>
  Math.max(1, Math.ceil(total / size));

export const clampPage = (page: number, total: number, size: number): number =>
  Math.min(Math.max(1, page), getTotalPages(total, size));

export const paginateTodos = (
  todos: Todo[],
  page: number,
  size: number,
): PaginatedTodos => {
  const currentPage = clampPage(page, todos.length, size);
  const start = (currentPage - 1) * size;

  return {
    items: todos.slice(start, start + size),
    page: currentPage,
    totalPages: getTotalPages(todos.length, size),
  };
};
