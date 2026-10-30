import { describe, expect, it } from "vitest";

import { reorderTodos } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const makeTodos = (count: number): Todo[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `id-${index + 1}`,
    title: `Todo ${index + 1}`,
    done: false,
  }));

const ids = (todos: Todo[]) => todos.map((todo) => todo.id);

describe("reorderTodos", () => {
  it("moves an item down within the page", () => {
    const result = reorderTodos(makeTodos(5), 0, 1, 3);

    expect(ids(result)).toEqual(["id-1", "id-3", "id-4", "id-2", "id-5"]);
  });

  it("moves an item up within the page", () => {
    const result = reorderTodos(makeTodos(5), 0, 3, 1);

    expect(ids(result)).toEqual(["id-1", "id-4", "id-2", "id-3", "id-5"]);
  });

  it("moves the first item to the last position", () => {
    const result = reorderTodos(makeTodos(5), 0, 0, 4);

    expect(ids(result)).toEqual(["id-2", "id-3", "id-4", "id-5", "id-1"]);
  });

  it("moves the last item to the first position", () => {
    const result = reorderTodos(makeTodos(5), 0, 4, 0);

    expect(ids(result)).toEqual(["id-5", "id-1", "id-2", "id-3", "id-4"]);
  });

  it("returns the same array when the index does not change", () => {
    const todos = makeTodos(5);

    expect(reorderTodos(todos, 0, 2, 2)).toBe(todos);
  });

  it("applies the page offset and keeps items on other pages in place", () => {
    const result = reorderTodos(makeTodos(12), 5, 0, 2);

    expect(ids(result)).toEqual([
      "id-1",
      "id-2",
      "id-3",
      "id-4",
      "id-5",
      "id-7",
      "id-8",
      "id-6",
      "id-9",
      "id-10",
      "id-11",
      "id-12",
    ]);
  });

  it("returns the same array for out-of-range indexes", () => {
    const todos = makeTodos(7);

    expect(reorderTodos(todos, 5, 0, 1)).not.toBe(todos);
    expect(reorderTodos(todos, 5, 0, 2)).toBe(todos);
    expect(reorderTodos(todos, 0, -1, 2)).toBe(todos);
    expect(reorderTodos(todos, 0, 2, 9)).toBe(todos);
    expect(reorderTodos(todos, 0, 9, 2)).toBe(todos);
  });

  it("does not mutate the input array", () => {
    const todos = makeTodos(5);

    reorderTodos(todos, 0, 0, 4);

    expect(ids(todos)).toEqual(["id-1", "id-2", "id-3", "id-4", "id-5"]);
  });
});
