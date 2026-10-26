import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useTodoSampleList } from "@/hooks/todo/use-todo-list.sample";

describe("useTodoSampleList", () => {
  it("starts with an empty todo list", () => {
    const { result } = renderHook(() => useTodoSampleList());

    expect(result.current.todos).toEqual([]);
  });

  it("toggleTodo on an unknown id leaves the list unchanged", () => {
    const { result } = renderHook(() => useTodoSampleList());

    act(() => {
      result.current.toggleTodo("missing");
    });

    expect(result.current.todos).toEqual([]);
  });
});
