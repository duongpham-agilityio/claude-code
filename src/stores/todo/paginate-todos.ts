// Types
import type { Todo } from "@/types/todo";

export interface PaginatedTodos {
  items: Todo[];
  page: number;
  totalPages: number;
}

export const paginateTodos = (
  todos: Todo[],
  page: number,
  pageSize: number,
): PaginatedTodos => {
  const totalPages = Math.max(1, Math.ceil(todos.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: todos.slice(start, start + pageSize),
    page: safePage,
    totalPages,
  };
};
