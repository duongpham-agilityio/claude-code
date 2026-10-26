import { afterEach, describe, expect, it } from "vitest";

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

describe("useTodoStore", () => {
  it("starts with an empty todo list", () => {
    expect(useTodoStore.getInitialState().todos).toEqual([]);
  });

  it("keeps todos set through setState", () => {
    useTodoStore.setState({ todos: [TODO] });

    expect(useTodoStore.getState().todos).toEqual([TODO]);
  });
});
