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
  it("splits 12 todos into pages of 5, 5 and 2", () => {
    const todos = makeTodos(12);

    const sizes = [1, 2, 3].map(
      (page) => paginateTodos(todos, page, 5).items.length,
    );

    expect(sizes).toEqual([5, 5, 2]);
    expect(paginateTodos(todos, 2, 5).items[0].id).toBe("id-6");
    expect(paginateTodos(todos, 1, 5).totalPages).toBe(3);
  });

  it("clamps a page above the range to the last page", () => {
    const result = paginateTodos(makeTodos(12), 99, 5);

    expect(result.page).toBe(3);
    expect(result.items).toHaveLength(2);
  });

  it("clamps a page below the range to the first page", () => {
    const result = paginateTodos(makeTodos(12), 0, 5);

    expect(result.page).toBe(1);
    expect(result.items).toHaveLength(5);
  });

  it("returns page 1 and 1 page for an empty list", () => {
    expect(paginateTodos([], 3, 5)).toEqual({
      items: [],
      page: 1,
      totalPages: 1,
    });
  });
});
