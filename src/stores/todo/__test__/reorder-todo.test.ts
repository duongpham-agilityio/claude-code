import { describe, expect, it } from "vitest";

import { reorderTodos } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const makeTodo = (id: string): Todo => ({ id, title: id, done: false });

const A = makeTodo("a");
const B = makeTodo("b");
const C = makeTodo("c");
const D = makeTodo("d");
const E = makeTodo("e");

const ids = (todos: Todo[]) => todos.map((todo) => todo.id);

describe("reorderTodos", () => {
  it("moves a todo down within the page", () => {
    expect(ids(reorderTodos([A, B, C], 0, 0, 2))).toEqual(["b", "c", "a"]);
  });

  it("moves a todo up within the page", () => {
    expect(ids(reorderTodos([A, B, C], 0, 2, 0))).toEqual(["c", "a", "b"]);
  });

  it("moves the first todo to the last position and back", () => {
    const moved = reorderTodos([A, B, C], 0, 0, 2);

    expect(ids(reorderTodos(moved, 0, 2, 0))).toEqual(["a", "b", "c"]);
  });

  it("returns an equal list when from and to are the same index", () => {
    expect(reorderTodos([A, B, C], 0, 1, 1)).toEqual([A, B, C]);
  });

  it("offsets indexes by pageStart for a non-first page", () => {
    expect(ids(reorderTodos([A, B, C, D, E], 2, 0, 1))).toEqual([
      "a",
      "b",
      "d",
      "c",
      "e",
    ]);
  });

  it("leaves the list unchanged for out-of-range indexes", () => {
    expect(reorderTodos([A, B, C], 0, 5, 0)).toEqual([A, B, C]);
    expect(reorderTodos([A, B, C], 0, 0, 5)).toEqual([A, B, C]);
    expect(reorderTodos([A, B, C], 0, -1, 1)).toEqual([A, B, C]);
    expect(reorderTodos([A, B, C], 0, 0, -1)).toEqual([A, B, C]);
    expect(reorderTodos([A, B, C], 2, 0, 3)).toEqual([A, B, C]);
  });

  it("does not mutate the input array", () => {
    const todos = [A, B, C];

    reorderTodos(todos, 0, 0, 2);

    expect(todos).toEqual([A, B, C]);
    expect(todos[0]).toBe(A);
  });
});
