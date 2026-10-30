import { describe, expect, it } from "vitest";

import { paginateTodos } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const makeTodos = (count: number): Todo[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `id-${index + 1}`,
    title: `Todo ${index + 1}`,
    done: false,
  }));

describe("paginateTodos", () => {
  it("returns the first 5 todos of 12 on page 1 with 3 pages", () => {
    const result = paginateTodos(makeTodos(12), 1);

    expect(result.pagedTodos.map((todo) => todo.id)).toEqual([
      "id-1",
      "id-2",
      "id-3",
      "id-4",
      "id-5",
    ]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
  });

  it("returns the next 5 todos on page 2", () => {
    const result = paginateTodos(makeTodos(12), 2);

    expect(result.pagedTodos.map((todo) => todo.id)).toEqual([
      "id-6",
      "id-7",
      "id-8",
      "id-9",
      "id-10",
    ]);
    expect(result.currentPage).toBe(2);
  });

  it("returns the remaining 2 todos on the last page", () => {
    const result = paginateTodos(makeTodos(12), 3);

    expect(result.pagedTodos.map((todo) => todo.id)).toEqual([
      "id-11",
      "id-12",
    ]);
    expect(result.currentPage).toBe(3);
    expect(result.totalPages).toBe(3);
  });

  it("clamps page 0 and negative pages to page 1", () => {
    expect(paginateTodos(makeTodos(12), 0).currentPage).toBe(1);
    expect(paginateTodos(makeTodos(12), -4).currentPage).toBe(1);
  });

  it("clamps a page beyond the last page to the last page", () => {
    const result = paginateTodos(makeTodos(12), 99);

    expect(result.currentPage).toBe(3);
    expect(result.pagedTodos).toHaveLength(2);
  });

  it("gives page 1 and 1 total page for an empty list", () => {
    const result = paginateTodos([], 4);

    expect(result.pagedTodos).toEqual([]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("keeps a list of exactly 5 todos on a single page", () => {
    const result = paginateTodos(makeTodos(5), 1);

    expect(result.pagedTodos).toHaveLength(5);
    expect(result.totalPages).toBe(1);
  });
});
