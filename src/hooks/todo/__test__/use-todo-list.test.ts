import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useTodoList } from "@/hooks/todo";
import { useTodoStore } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const TODO: Todo = {
  id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  title: "Buy milk",
  done: false,
};

afterEach(() => {
  vi.restoreAllMocks();
  useTodoStore.setState(useTodoStore.getInitialState());
});

describe("useTodoList", () => {
  it("starts with an empty todo list", () => {
    const { result } = renderHook(() => useTodoList());

    expect(result.current.todos).toEqual([]);
  });

  it("reflects todos set in the store", () => {
    const { result } = renderHook(() => useTodoList());

    act(() => {
      useTodoStore.setState({ todos: [TODO] });
    });

    expect(result.current.todos).toEqual([TODO]);
  });

  it("addTodo adds a trimmed todo at the top and returns true", () => {
    const { result } = renderHook(() => useTodoList());
    useTodoStore.setState({ todos: [TODO] });

    let added = false;
    act(() => {
      added = result.current.addTodo("  New  ");
    });

    expect(added).toBe(true);
    expect(result.current.todos.map((todo) => todo.title)).toEqual([
      "New",
      "Buy milk",
    ]);
  });

  it("updateTodo changes the title of that todo only", () => {
    const other: Todo = {
      id: "0a1b2c3d-4e5f-4a6b-9c7d-8e9f0a1b2c3d",
      title: "Walk dog",
      done: true,
    };
    const { result } = renderHook(() => useTodoList());
    act(() => {
      useTodoStore.setState({ todos: [TODO, other] });
    });

    act(() => {
      result.current.updateTodo(TODO.id, "  Buy bread  ");
    });

    expect(result.current.todos.map((todo) => todo.title)).toEqual([
      "Buy bread",
      other.title,
    ]);
    expect(result.current.todos.map((todo) => todo.done)).toEqual([
      TODO.done,
      other.done,
    ]);
  });

  it("addTodo alerts and returns false when adding throws", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
      throw new Error("boom");
    });
    const { result } = renderHook(() => useTodoList());

    let added = true;
    act(() => {
      added = result.current.addTodo("New");
    });

    expect(added).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith("boom");
    expect(result.current.todos).toEqual([]);
  });
});
