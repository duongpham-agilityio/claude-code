import { describe, expect, it } from "vitest";

import { updateTodoTitle } from "@/stores/todo";
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

describe("updateTodoTitle", () => {
  it("changes only the todo with the given id", () => {
    expect(updateTodoTitle([FIRST, SECOND], FIRST.id, "New")).toEqual([
      { ...FIRST, title: "New" },
      SECOND,
    ]);
  });

  it("trims the title", () => {
    expect(updateTodoTitle([FIRST], FIRST.id, "  New  ")[0].title).toBe("New");
  });

  it("keeps done and order", () => {
    const result = updateTodoTitle([FIRST, SECOND], SECOND.id, "New");

    expect(result[1].id).toBe(SECOND.id);
    expect(result[1].done).toBe(true);
  });

  it("does not change the todo with the same title", () => {
    const result = updateTodoTitle([FIRST, SECOND], SECOND.id, "New");

    expect(result[0].title).toBe("Same");
    expect(result[1].title).toBe("New");
  });

  it("does not mutate the input array", () => {
    const todos = [FIRST, SECOND];

    updateTodoTitle(todos, FIRST.id, "New");

    expect(todos[0].title).toBe("Same");
    expect(FIRST.title).toBe("Same");
  });
});
