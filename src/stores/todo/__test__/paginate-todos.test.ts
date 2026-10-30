import { describe, expect, it } from "vitest";

import { clampPage, paginateTodos } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const makeTodos = (count: number): Todo[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `id-${index + 1}`,
    title: `Todo ${index + 1}`,
    done: false,
  }));

describe("paginateTodos", () => {
  const todos = makeTodos(12);

  it("slices 12 todos into pages of 5, 5 and 2", () => {
    expect(paginateTodos(todos, 1, 5).items).toHaveLength(5);
    expect(paginateTodos(todos, 2, 5).items).toHaveLength(5);
    expect(paginateTodos(todos, 3, 5).items).toHaveLength(2);
    expect(paginateTodos(todos, 2, 5).items[0].id).toBe("id-6");
  });

  it("returns the total number of pages", () => {
    expect(paginateTodos(todos, 1, 5).totalPages).toBe(3);
    expect(paginateTodos(makeTodos(5), 1, 5).totalPages).toBe(1);
  });

  it("clamps a page that is too high to the last page", () => {
    const result = paginateTodos(todos, 99, 5);

    expect(result.page).toBe(3);
    expect(result.items.map((todo) => todo.id)).toEqual(["id-11", "id-12"]);
  });

  it("clamps a page below 1 to the first page", () => {
    const result = paginateTodos(todos, 0, 5);

    expect(result.page).toBe(1);
    expect(result.items).toHaveLength(5);
  });

  it("returns page 1 with no items and one page for zero todos", () => {
    expect(paginateTodos([], 4, 5)).toEqual({
      items: [],
      page: 1,
      totalPages: 1,
    });
  });
});

describe("clampPage", () => {
  it("keeps a valid page", () => {
    expect(clampPage(2, 12, 5)).toBe(2);
  });

  it("clamps to the last page and to 1", () => {
    expect(clampPage(10, 12, 5)).toBe(3);
    expect(clampPage(-3, 12, 5)).toBe(1);
  });

  it("returns 1 when there are no todos", () => {
    expect(clampPage(5, 0, 5)).toBe(1);
  });
});
