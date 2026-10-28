import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Todo } from "@/types/todo";

import { TodoList } from "./index";

afterEach(cleanup);

const TODOS: Todo[] = [
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    title: "Open task",
    done: false,
  },
  {
    id: "9b2f1c3a-5d4e-4f6a-8b7c-1d2e3f4a5b6c",
    title: "Done task",
    done: true,
  },
  {
    id: "0a1b2c3d-4e5f-4a6b-9c7d-8e9f0a1b2c3d",
    title: "Another task",
    done: false,
  },
];

describe("TodoList", () => {
  it("shows the empty message and no list when there are no todos", () => {
    render(<TodoList todos={[]} />);

    expect(screen.getByText("No todos yet")).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("renders one list item per todo with its title", () => {
    render(<TodoList todos={TODOS} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    for (const todo of TODOS) {
      expect(screen.getByText(todo.title)).toBeInTheDocument();
    }
  });

  it("strikes through the title of a done todo only", () => {
    render(<TodoList todos={TODOS} />);

    expect(screen.getByText("Done task")).toHaveClass("line-through");
    expect(screen.getByText("Open task")).not.toHaveClass("line-through");
  });

  it("renders todos that share a title", () => {
    render(
      <TodoList
        todos={[
          {
            id: "11111111-1111-4111-8111-111111111111",
            title: "Same",
            done: false,
          },
          {
            id: "22222222-2222-4222-8222-222222222222",
            title: "Same",
            done: false,
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("switches between empty state and list as todos change", () => {
    const { rerender } = render(<TodoList todos={[]} />);
    expect(screen.getByText("No todos yet")).toBeInTheDocument();

    rerender(<TodoList todos={[TODOS[0]]} />);
    expect(screen.queryByText("No todos yet")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);

    rerender(<TodoList todos={[]} />);
    expect(screen.getByText("No todos yet")).toBeInTheDocument();
  });

  it("calls onEdit with the id of the edited todo and the trimmed new title", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<TodoList todos={TODOS} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Edit Another task" }));
    const input = screen.getByRole("textbox", { name: "Todo title" });
    await user.clear(input);
    await user.type(input, "  Renamed  ");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(
      "0a1b2c3d-4e5f-4a6b-9c7d-8e9f0a1b2c3d",
      "Renamed",
    );
  });

  it("does not call onEdit on Cancel", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<TodoList todos={TODOS} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Edit Another task" }));
    await user.type(screen.getByRole("textbox", { name: "Todo title" }), "x");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText("Another task")).toBeInTheDocument();
  });

  it("calls onRemove with the id of the row whose Delete was clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<TodoList todos={TODOS} onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: "Delete Done task" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith(TODOS[1].id);
  });
});
