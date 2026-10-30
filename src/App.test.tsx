import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useTodoStore } from "@/stores/todo";

import App from "./App";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
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

  it("adds a todo via the Add button and shows it in the list", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole("textbox", { name: "New todo" });
    await user.type(input, "  Buy milk  ");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(screen.queryByText("No todos yet")).not.toBeInTheDocument();
  });

  it("adds a todo via Enter", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: "New todo" }),
      "Write plan{Enter}",
    );

    expect(screen.getByText("Write plan")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("shows the newest todo first and allows duplicate titles", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole("textbox", { name: "New todo" });
    await user.type(input, "A{Enter}");
    await user.type(input, "B{Enter}");
    await user.type(input, "A{Enter}");
    await user.type(input, "C{Enter}");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(
      items.map((item) => item.textContent?.replace(/EditDelete$/, "")),
    ).toEqual(["C", "A", "B", "A"]);
  });

  it("does not add a whitespace-only title", async () => {
    const user = userEvent.setup();
    render(<App />);

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    await user.type(screen.getByRole("textbox", { name: "New todo" }), "   ");

    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
    await user.keyboard("{Enter}");
    expect(screen.getByText("No todos yet")).toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("alerts, adds nothing and keeps the typed value when adding throws", async () => {
    const user = userEvent.setup();
    render(<App />);
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
      throw new Error("boom");
    });

    const input = screen.getByRole("textbox", { name: "New todo" });
    await user.type(input, "Buy milk{Enter}");

    expect(alertSpy).toHaveBeenCalledWith("boom");
    expect(screen.getByText("No todos yet")).toBeInTheDocument();
    expect(input).toHaveValue("Buy milk");
  });

  it("deletes only the clicked todo", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);
    const FIRST = "11111111-1111-4111-8111-111111111111";
    const SECOND = "22222222-2222-4222-8222-222222222222";
    act(() => {
      useTodoStore.setState({
        todos: [
          { id: FIRST, title: "Same", done: false },
          { id: SECOND, title: "Same", done: false },
        ],
      });
    });

    await user.click(screen.getAllByRole("button", { name: "Delete Same" })[0]);

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(useTodoStore.getState().todos.map((todo) => todo.id)).toEqual([
      SECOND,
    ]);
  });

  it("shows No todos yet after the last todo is deleted", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);
    act(() => {
      useTodoStore.setState({
        todos: [
          {
            id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
            title: "Buy milk",
            done: false,
          },
        ],
      });
    });

    await user.click(screen.getByRole("button", { name: "Delete Buy milk" }));

    expect(screen.getByText("No todos yet")).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("keeps the todo when the delete confirmation is cancelled", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<App />);
    act(() => {
      useTodoStore.setState({
        todos: [
          {
            id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
            title: "Buy milk",
            done: false,
          },
        ],
      });
    });

    await user.click(screen.getByRole("button", { name: "Delete Buy milk" }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(useTodoStore.getState().todos).toHaveLength(1);
  });

  it("shows 5 of 12 todos and navigates between pages", async () => {
    const user = userEvent.setup();
    render(<App />);
    act(() => {
      useTodoStore.setState({
        todos: Array.from({ length: 12 }, (_, index) => ({
          id: `id-${index + 1}`,
          title: `Task ${index + 1}`,
          done: false,
        })),
      });
    });

    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 6")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Task 6")).toBeInTheDocument();
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "3" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("hides the pagination for 5 or fewer todos", () => {
    render(<App />);
    act(() => {
      useTodoStore.setState({
        todos: Array.from({ length: 5 }, (_, index) => ({
          id: `id-${index + 1}`,
          title: `Task ${index + 1}`,
          done: false,
        })),
      });
    });

    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("goes back to the new todo on page 1 after adding from another page", async () => {
    const user = userEvent.setup();
    render(<App />);
    act(() => {
      useTodoStore.setState({
        todos: Array.from({ length: 12 }, (_, index) => ({
          id: `id-${index + 1}`,
          title: `Task ${index + 1}`,
          done: false,
        })),
      });
    });
    await user.click(screen.getByRole("button", { name: "3" }));

    await user.type(
      screen.getByRole("textbox", { name: "New todo" }),
      "Fresh{Enter}",
    );

    expect(screen.getByText("Fresh")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("moves to the previous page when the last todo of the last page is deleted", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);
    act(() => {
      useTodoStore.setState({
        todos: Array.from({ length: 6 }, (_, index) => ({
          id: `id-${index + 1}`,
          title: `Task ${index + 1}`,
          done: false,
        })),
      });
    });
    await user.click(screen.getByRole("button", { name: "2" }));

    await user.click(screen.getByRole("button", { name: "Delete Task 6" }));

    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
