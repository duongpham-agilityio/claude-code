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

  it("removeTodo throws and keeps todos when the id is unknown", () => {
    useTodoStore.setState({ todos: [TODO] });

    expect(() => useTodoStore.getState().removeTodo("missing-id")).toThrow(
      "Could not delete the todo. Please try again.",
    );
    expect(useTodoStore.getState().todos).toEqual([TODO]);
  });

  it("starts on page 1", () => {
    expect(useTodoStore.getInitialState().currentPage).toBe(1);
  });

  it("setPage moves to a valid page", () => {
    useTodoStore.setState({ todos: makeTodos(12) });

    useTodoStore.getState().setPage(2);

    expect(useTodoStore.getState().currentPage).toBe(2);
  });

  it("setPage clamps out-of-range pages", () => {
    useTodoStore.setState({ todos: makeTodos(12) });

    useTodoStore.getState().setPage(99);
    expect(useTodoStore.getState().currentPage).toBe(3);

    useTodoStore.getState().setPage(0);
    expect(useTodoStore.getState().currentPage).toBe(1);
  });

  it("addTodo resets the current page to 1", () => {
    useTodoStore.setState({ todos: makeTodos(12), currentPage: 3 });

    useTodoStore.getState().addTodo("New");

    expect(useTodoStore.getState().currentPage).toBe(1);
  });

  it("removeTodo of the last todo on the last page moves back one page", () => {
    useTodoStore.setState({ todos: makeTodos(6), currentPage: 2 });

    useTodoStore.getState().removeTodo("id-6");

    expect(useTodoStore.getState().currentPage).toBe(1);
  });

  it("removeTodo keeps the page when it is still valid", () => {
    useTodoStore.setState({ todos: makeTodos(12), currentPage: 2 });

    useTodoStore.getState().removeTodo("id-1");

    expect(useTodoStore.getState().currentPage).toBe(2);
  });

  it("removeTodo of the only todo leaves the page at 1", () => {
    useTodoStore.setState({ todos: [TODO], currentPage: 1 });

    useTodoStore.getState().removeTodo(TODO.id);

    expect(useTodoStore.getState().currentPage).toBe(1);
  });

  it("toggleTodo and updateTodo do not change the page", () => {
    useTodoStore.setState({ todos: makeTodos(12), currentPage: 2 });

    useTodoStore.getState().toggleTodo("id-7", true);
    useTodoStore.getState().updateTodo("id-7", "Renamed");

    expect(useTodoStore.getState().currentPage).toBe(2);
  });
});
