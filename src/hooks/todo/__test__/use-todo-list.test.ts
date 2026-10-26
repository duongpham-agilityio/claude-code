import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useTodoList } from "@/hooks/todo";
import { useTodoStore } from "@/stores/todo";
import type { Todo } from "@/types/todo";

const TODO: Todo = {
  id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  title: "Buy milk",
  done: false,
};

afterEach(() => {
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
});
