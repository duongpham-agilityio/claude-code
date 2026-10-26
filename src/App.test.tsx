import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useTodoStore } from "@/stores/todo";

import App from "./App";

afterEach(() => {
  cleanup();
  useTodoStore.setState(useTodoStore.getInitialState());
});

describe("App", () => {
  it("shows the app heading and the empty state", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Todo Practice" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No todos yet")).toBeInTheDocument();
  });

  it("renders todos from the store", () => {
    render(<App />);

    act(() => {
      useTodoStore.setState({
        todos: [
          {
            id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
            title: "Buy milk",
            done: false,
          },
          {
            id: "9b2f1c3a-5d4e-4f6a-8b7c-1d2e3f4a5b6c",
            title: "Write plan",
            done: true,
          },
        ],
      });
    });

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Write plan")).toBeInTheDocument();
  });
});
