import { afterEach, describe, expect, it } from "vitest";

import { useTodoStore } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const TODO: Todo = {
  id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  title: "Buy milk",
  done: false,
};

const makeTodos = (count: number): Todo[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `id-${index + 1}`,
    title: `Todo ${index + 1}`,
    done: false,
  }));

afterEach(() => {
  useTodoStore.setState(useTodoStore.getInitialState());
});

describe("useTodoStore", () => {
  it("starts with an empty todo list", () => {
    expect(useTodoStore.getInitialState().todos).toEqual([]);
  });

  it("keeps todos set through setState", () => {
    useTodoStore.setState({ todos: [TODO] });

    expect(useTodoStore.getState().todos).toEqual([TODO]);
  });

  it("addTodo puts the new todo first and keeps the rest in order", () => {
    useTodoStore.setState({ todos: [TODO] });

    useTodoStore.getState().addTodo("New");

    expect(useTodoStore.getState().todos.map((todo) => todo.title)).toEqual([
      "New",
      "Buy milk",
    ]);
  });

  it("addTodo allows duplicate titles with different ids", () => {
    useTodoStore.getState().addTodo("Same");
    useTodoStore.getState().addTodo("Same");

    const todos = useTodoStore.getState().todos;

    expect(todos).toHaveLength(2);
    expect(todos[0].id).not.toBe(todos[1].id);
  });

  it("addTodo throws and leaves todos unchanged for a blank title", () => {
    expect(() => useTodoStore.getState().addTodo("  ")).toThrow(
      "Title is required",
    );
    expect(useTodoStore.getState().todos).toEqual([]);
  });

  it("updateTodo changes the title of the matching todo only", () => {
    const other: Todo = { id: "other-id", title: "Other", done: true };
    useTodoStore.setState({ todos: [TODO, other] });

    useTodoStore.getState().updateTodo(other.id, "  Renamed  ");

    expect(useTodoStore.getState().todos.map((todo) => todo.title)).toEqual([
      "Buy milk",
      "Renamed",
    ]);
  });

  it("toggleTodo sets done on the matching todo", () => {
    useTodoStore.getState().addTodo("Buy milk");
    const id = useTodoStore.getState().todos[0].id;

    useTodoStore.getState().toggleTodo(id, true);

    expect(useTodoStore.getState().todos[0].done).toBe(true);
  });

  it("removeTodo removes the todo from the store", () => {
    const other: Todo = { id: "other-id", title: "Other", done: true };
    useTodoStore.setState({ todos: [TODO, other] });

    useTodoStore.getState().removeTodo(TODO.id);

    expect(useTodoStore.getState().todos).toEqual([other]);
  });

  it("reorderTodo moves a todo within the first page", () => {
    useTodoStore.setState({ todos: makeTodos(8) });

    useTodoStore.getState().reorderTodo(0, 0, 2);

    expect(useTodoStore.getState().todos.map((todo) => todo.id)).toEqual([
      "id-2",
      "id-3",
      "id-1",
      "id-4",
      "id-5",
      "id-6",
      "id-7",
      "id-8",
    ]);
  });

  it("reorderTodo uses the page offset", () => {
    useTodoStore.setState({ todos: makeTodos(8) });

    useTodoStore.getState().reorderTodo(5, 0, 2);

    expect(useTodoStore.getState().todos.map((todo) => todo.id)).toEqual([
      "id-1",
      "id-2",
      "id-3",
      "id-4",
      "id-5",
      "id-7",
      "id-8",
      "id-6",
    ]);
  });

  it("reorderTodo keeps todos for an out-of-range index", () => {
    const todos = makeTodos(8);
    useTodoStore.setState({ todos });

    useTodoStore.getState().reorderTodo(5, 0, 4);

    expect(useTodoStore.getState().todos).toBe(todos);
  });

  it("removeTodo throws and keeps todos when the id is unknown", () => {
    useTodoStore.setState({ todos: [TODO] });

    expect(() => useTodoStore.getState().removeTodo("missing-id")).toThrow(
      "Could not delete the todo. Please try again.",
    );
    expect(useTodoStore.getState().todos).toEqual([TODO]);
  });
});
