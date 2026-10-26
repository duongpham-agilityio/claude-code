import { describe, it } from "vitest";

// `todoStore` is still a `null` placeholder in ../base.sample.ts.
// Replace these with real tests once the zustand store is implemented.
describe("todoStore", () => {
  it.todo("starts with an empty todo list");
  it.todo("toggles a todo's completed flag by id");
  it.todo("ignores toggling an unknown id");
});
