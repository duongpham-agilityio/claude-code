import { describe, expect, it } from "vitest";

import { toggleTodoDone } from "@/stores/todo";
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

describe("toggleTodoDone", () => {
  it("sets done on only the todo with the given id", () => {
    expect(toggleTodoDone([FIRST, SECOND], FIRST.id, true)).toEqual([
      { ...FIRST, done: true },
      SECOND,
    ]);
  });

  it("can set a done todo back to not done", () => {
    expect(toggleTodoDone([FIRST, SECOND], SECOND.id, false)[1].done).toBe(
      false,
    );
  });

  it("keeps title and order", () => {
    const result = toggleTodoDone([FIRST, SECOND], FIRST.id, true);

    expect(result.map((todo) => todo.id)).toEqual([FIRST.id, SECOND.id]);
    expect(result.map((todo) => todo.title)).toEqual(["Same", "Same"]);
  });

  it("leaves the list unchanged for an unknown id", () => {
    expect(toggleTodoDone([FIRST, SECOND], "missing", true)).toEqual([
      FIRST,
      SECOND,
    ]);
  });

  it("does not mutate the input", () => {
    const todos = [FIRST, SECOND];

    toggleTodoDone(todos, FIRST.id, true);

    expect(todos).toEqual([FIRST, SECOND]);
    expect(FIRST.done).toBe(false);
  });
});
