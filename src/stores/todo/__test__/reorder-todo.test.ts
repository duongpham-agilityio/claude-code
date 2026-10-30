import { describe, expect, it } from "vitest";

import { reorderTodos } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const make = (title: string): Todo => ({
  id: `id-${title}`,
  title,
  done: false,
});

const A = make("A");
const B = make("B");
const C = make("C");
const D = make("D");
const E = make("E");

const titles = (todos: Todo[]): string[] => todos.map((todo) => todo.title);

describe("reorderTodos", () => {
  it("moves a todo down within the page", () => {
    expect(titles(reorderTodos([A, B, C], 0, 0, 1))).toEqual(["B", "A", "C"]);
  });

  it("moves a todo up within the page", () => {
    expect(titles(reorderTodos([A, B, C], 0, 2, 0))).toEqual(["C", "A", "B"]);
  });

  it("moves the first todo to the last position", () => {
    expect(titles(reorderTodos([A, B, C], 0, 0, 2))).toEqual(["B", "C", "A"]);
  });

  it("returns the same array when the index does not change", () => {
    const todos = [A, B, C];

    expect(reorderTodos(todos, 0, 1, 1)).toBe(todos);
  });

  it("offsets indexes by the page start and keeps other pages in place", () => {
    expect(titles(reorderTodos([A, B, C, D, E], 2, 0, 1))).toEqual([
      "A",
      "B",
      "D",
      "C",
      "E",
    ]);
  });

  it("returns the same array for out of range indexes", () => {
    const todos = [A, B];

    expect(reorderTodos(todos, 0, 0, 5)).toBe(todos);
    expect(reorderTodos(todos, 0, -1, 1)).toBe(todos);
  });

  it("does not mutate the input array", () => {
    const todos = [A, B, C];
    reorderTodos(todos, 0, 0, 2);

    expect(titles(todos)).toEqual(["A", "B", "C"]);
  });
});
