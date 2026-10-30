import { describe, expect, it } from "vitest";

import { reorderTodos } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const makeTodos = (count: number): Todo[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `id-${index}`,
    title: `Todo ${index}`,
    done: false,
  }));

const ids = (todos: Todo[]) => todos.map((todo) => todo.id);

describe("reorderTodos", () => {
  it("moves a todo down within the page", () => {
    const result = reorderTodos(makeTodos(3), 0, 0, 1);

    expect(ids(result)).toEqual(["id-1", "id-0", "id-2"]);
  });

  it("moves a todo up within the page", () => {
    const result = reorderTodos(makeTodos(3), 0, 2, 0);

    expect(ids(result)).toEqual(["id-2", "id-0", "id-1"]);
  });

  it("moves the first todo to the last position", () => {
    const result = reorderTodos(makeTodos(4), 0, 0, 3);

    expect(ids(result)).toEqual(["id-1", "id-2", "id-3", "id-0"]);
  });

  it("returns the same order when from and to are equal", () => {
    const todos = makeTodos(3);

    expect(reorderTodos(todos, 0, 1, 1)).toEqual(todos);
  });

  it("applies the page offset and keeps other pages untouched", () => {
    const result = reorderTodos(makeTodos(8), 5, 0, 2);

    expect(ids(result)).toEqual([
      "id-0",
      "id-1",
      "id-2",
      "id-3",
      "id-4",
      "id-6",
      "id-7",
      "id-5",
    ]);
  });

  it("changes nothing when an index is out of range", () => {
    const todos = makeTodos(3);

    expect(reorderTodos(todos, 0, 0, 5)).toEqual(todos);
    expect(reorderTodos(todos, 0, -1, 1)).toEqual(todos);
  });

  it("does not mutate the input", () => {
    const todos = makeTodos(3);
    const snapshot = [...todos];

    reorderTodos(todos, 0, 0, 2);

    expect(todos).toEqual(snapshot);
  });
});
