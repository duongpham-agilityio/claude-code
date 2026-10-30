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

const makeTodos = (count: number): Todo[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `id-${index + 1}`,
    title: `Todo ${index + 1}`,
    done: false,
  }));

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

  it("toggleTodo marks the todo as done", () => {
    const { result } = renderHook(() => useTodoList());
    act(() => {
      useTodoStore.setState({ todos: [TODO] });
    });

    act(() => {
      result.current.toggleTodo(TODO.id, true);
    });

    expect(result.current.todos[0].done).toBe(true);
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

  it("removeTodo removes that todo only", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
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
      result.current.removeTodo(TODO.id);
    });

    expect(result.current.todos).toEqual([other]);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("removeTodo alerts the delete error and keeps the list when the id is unknown", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useTodoList());
    act(() => {
      useTodoStore.setState({ todos: [TODO] });
    });

    act(() => {
      result.current.removeTodo("missing-id");
    });

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      "Could not delete the todo. Please try again.",
    );
    expect(result.current.todos).toEqual([TODO]);
  });

  it("returns only the first page of todos with page info", () => {
    const { result } = renderHook(() => useTodoList());

    act(() => {
      useTodoStore.setState({ todos: makeTodos(12) });
    });

    expect(result.current.pagedTodos.map((todo) => todo.id)).toEqual([
      "id-1",
      "id-2",
      "id-3",
      "id-4",
      "id-5",
    ]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
  });

  it("setPage moves to another page slice", () => {
    const { result } = renderHook(() => useTodoList());
    act(() => {
      useTodoStore.setState({ todos: makeTodos(12) });
    });

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.pagedTodos.map((todo) => todo.id)).toEqual([
      "id-11",
      "id-12",
    ]);
  });

  it("reorderTodo moves a todo within the current page of the full list", () => {
    const { result } = renderHook(() => useTodoList());
    act(() => {
      useTodoStore.setState({ todos: makeTodos(8) });
    });
    act(() => {
      result.current.setPage(2);
    });

    act(() => {
      result.current.reorderTodo(0, 2);
    });

    expect(result.current.todos.map((todo) => todo.id)).toEqual([
      "id-1",
      "id-2",
      "id-3",
      "id-4",
      "id-5",
      "id-7",
      "id-8",
      "id-6",
    ]);
    expect(result.current.pagedTodos.map((todo) => todo.id)).toEqual([
      "id-7",
      "id-8",
      "id-6",
    ]);
  });

  it("addTodo goes back to page 1 so the new todo is visible", () => {
    const { result } = renderHook(() => useTodoList());
    act(() => {
      useTodoStore.setState({ todos: makeTodos(12) });
    });
    act(() => {
      result.current.setPage(3);
    });

    act(() => {
      result.current.addTodo("Fresh");
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pagedTodos[0].title).toBe("Fresh");
  });

  it("moves back to the last valid page when the last todo of the last page is removed", () => {
    const { result } = renderHook(() => useTodoList());
    act(() => {
      useTodoStore.setState({ todos: makeTodos(11) });
    });
    act(() => {
      result.current.setPage(3);
    });

    act(() => {
      result.current.removeTodo("id-11");
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pagedTodos).toHaveLength(5);
  });
});
