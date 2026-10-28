import { describe, expect, it } from "vitest";

import { removeTodo } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const FIRST: Todo = {
  id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  title: "Same",
  done: false,
};

const SECOND: Todo = {
  id: "0a1b2c3d-4e5f-4a6b-9c7d-8e9f0a1b2c3d",
  title: "Same",
  done: true,
};

const THIRD: Todo = {
  id: "11111111-2222-4333-8444-555555555555",
  title: "Third",
  done: false,
};

describe("removeTodo", () => {
  it("removes only the todo with the given id", () => {
    expect(removeTodo([FIRST, SECOND], FIRST.id)).toEqual([SECOND]);
  });

  it("keeps the order of the remaining todos", () => {
    expect(removeTodo([FIRST, SECOND, THIRD], SECOND.id)).toEqual([
      FIRST,
      THIRD,
    ]);
  });

  it("returns an empty array when the last todo is removed", () => {
    expect(removeTodo([FIRST], FIRST.id)).toEqual([]);
  });

  it("throws the delete error when the id is not in the list", () => {
    expect(() => removeTodo([FIRST], "missing-id")).toThrow(
      "Could not delete the todo. Please try again.",
    );
  });

  it("does not mutate the input array", () => {
    const todos = [FIRST, SECOND];

    removeTodo(todos, FIRST.id);

    expect(todos).toHaveLength(2);
    expect(todos[0]).toBe(FIRST);
    expect(todos[1]).toBe(SECOND);
  });
});
