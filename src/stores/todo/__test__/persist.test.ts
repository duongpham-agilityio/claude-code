import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TODO_STORAGE_KEY, useTodoStore } from "@/stores/todo";

const reset = () => {
  localStorage.clear();
  useTodoStore.setState(useTodoStore.getInitialState());
};

beforeEach(reset);

afterEach(reset);

const store = (state: unknown) =>
  JSON.stringify({ state, version: 0 });

describe("useTodoStore persistence", () => {
  it("writes todos to localStorage under TODO_STORAGE_KEY after addTodo", () => {
    useTodoStore.getState().addTodo("Buy milk");

    const saved = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "null");

    expect(saved.state.todos[0].title).toBe("Buy milk");
    expect(Object.keys(saved.state)).toEqual(["todos"]);
  });

  it("does not persist currentPage and starts on page 1 after rehydrate", async () => {
    useTodoStore.getState().addTodo("Buy milk");
    useTodoStore.setState({ currentPage: 3 });

    const saved = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "null");
    expect(saved.state).not.toHaveProperty("currentPage");

    // Simulate a page reload: memory is reset, only localStorage survives
    const raw = localStorage.getItem(TODO_STORAGE_KEY) ?? "";
    useTodoStore.setState(useTodoStore.getInitialState());
    localStorage.setItem(TODO_STORAGE_KEY, raw);
    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos[0].title).toBe("Buy milk");
    expect(useTodoStore.getState().currentPage).toBe(1);
  });

  it("restores todos from localStorage on rehydrate", async () => {
    const todos = [{ id: "a", title: "Buy milk", done: true }];
    localStorage.setItem(TODO_STORAGE_KEY, store({ todos }));

    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos).toEqual(todos);
  });

  it("keeps done state and edited title across rehydrate", async () => {
    useTodoStore.getState().addTodo("Buy milk");
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().toggleTodo(id, true);
    useTodoStore.getState().updateTodo(id, "Renamed");

    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos[0]).toMatchObject({
      title: "Renamed",
      done: true,
    });
  });

  it("keeps the reordered todos across rehydrate", async () => {
    useTodoStore.setState({
      todos: [
        { id: "a", title: "A", done: false },
        { id: "b", title: "B", done: false },
        { id: "c", title: "C", done: false },
      ],
    });

    useTodoStore.getState().reorderTodo(0, 2);
    const saved = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "null");
    expect(saved.state.todos.map((todo: { id: string }) => todo.id)).toEqual([
      "b",
      "c",
      "a",
    ]);

    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos.map((todo) => todo.id)).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("starts empty when stored JSON is corrupt", async () => {
    localStorage.setItem(TODO_STORAGE_KEY, "{not json");

    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos).toEqual([]);
  });

  it("starts empty when stored todos is not an array", async () => {
    localStorage.setItem(TODO_STORAGE_KEY, store({ todos: "oops" }));

    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos).toEqual([]);
  });

  it("drops stored entries that are not valid todos", async () => {
    const valid = { id: "a", title: "Ok", done: false };
    localStorage.setItem(
      TODO_STORAGE_KEY,
      store({
        todos: [valid, { id: "b" }, { id: "c", title: "X", done: "yes" }, null],
      }),
    );

    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos).toEqual([valid]);
  });
});
