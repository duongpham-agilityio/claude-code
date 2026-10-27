import { describe, expect, it } from "vitest";

import { createTodo } from "@/stores/todo";

describe("createTodo", () => {
  it("trims the title and sets done to false", () => {
    const todo = createTodo("  Buy  milk  ");

    expect(todo.title).toBe("Buy  milk");
    expect(todo.done).toBe(false);
  });

  it("gives each todo a unique uuid id", () => {
    const first = createTodo("Same");
    const second = createTodo("Same");

    expect(first.id).not.toBe(second.id);
    expect(first.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(second.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("throws Title is required for empty or whitespace-only input", () => {
    expect(() => createTodo("")).toThrow("Title is required");
    expect(() => createTodo("   ")).toThrow("Title is required");
  });
});
