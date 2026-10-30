import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TODO_STORAGE_KEY, useTodoStore } from "@/stores/todo";

const reset = () => {
  localStorage.clear();
  useTodoStore.setState(useTodoStore.getInitialState());
};

beforeEach(reset);

afterEach(reset);

const titles = () => useTodoStore.getState().todos.map((todo) => todo.title);

describe("useTodoStore reorderTodo", () => {
  it("moves a todo and keeps the new order after rehydrate", async () => {
    const { addTodo } = useTodoStore.getState();
    addTodo("C");
    addTodo("B");
    addTodo("A");
    expect(titles()).toEqual(["A", "B", "C"]);

    useTodoStore.getState().reorderTodo(0, 0, 2);

    expect(titles()).toEqual(["B", "C", "A"]);

    const saved = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "null");
    expect(
      saved.state.todos.map((todo: { title: string }) => todo.title),
    ).toEqual(["B", "C", "A"]);

    await useTodoStore.persist.rehydrate();

    expect(titles()).toEqual(["B", "C", "A"]);
  });

  it("keeps new todos at the top after a reorder", () => {
    const { addTodo } = useTodoStore.getState();
    addTodo("B");
    addTodo("A");
    useTodoStore.getState().reorderTodo(0, 0, 1);

    useTodoStore.getState().addTodo("New");

    expect(titles()).toEqual(["New", "B", "A"]);
  });

  it("applies the page offset", () => {
    const { addTodo } = useTodoStore.getState();
    ["D", "C", "B", "A"].forEach((title) => addTodo(title));

    useTodoStore.getState().reorderTodo(2, 0, 1);

    expect(titles()).toEqual(["A", "B", "D", "C"]);
  });
});
