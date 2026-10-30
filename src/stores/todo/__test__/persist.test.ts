import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TODO_STORAGE_KEY, useTodoStore } from "@/stores/todo";

const reset = () => {
  localStorage.clear();
  useTodoStore.setState(useTodoStore.getInitialState());
};

beforeEach(reset);

afterEach(reset);

const store = (state: unknown) => JSON.stringify({ state, version: 0 });

describe("useTodoStore persistence", () => {
  it("writes todos to localStorage under TODO_STORAGE_KEY after addTodo", () => {
    useTodoStore.getState().addTodo("Buy milk");

    const saved = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "null");

    expect(saved.state.todos[0].title).toBe("Buy milk");
    expect(Object.keys(saved.state)).toEqual(["todos"]);
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

  it("does not persist currentPage, so a reload starts on page 1", async () => {
    useTodoStore.setState({
      todos: Array.from({ length: 12 }, (_, index) => ({
        id: `id-${index}`,
        title: `Todo ${index}`,
        done: false,
      })),
    });
    useTodoStore.getState().setPage(3);

    const saved = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) ?? "null");
    expect(Object.keys(saved.state)).toEqual(["todos"]);

    // Simulate a reload: fresh in-memory state, then rehydrate from storage.
    const stored = localStorage.getItem(TODO_STORAGE_KEY) ?? "";
    useTodoStore.setState({ todos: [], currentPage: 1 });
    localStorage.setItem(TODO_STORAGE_KEY, stored);
    await useTodoStore.persist.rehydrate();

    expect(useTodoStore.getState().todos).toHaveLength(12);
    expect(useTodoStore.getState().currentPage).toBe(1);
  });
});
