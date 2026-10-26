import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TodoItemSample } from "./index.sample";

afterEach(cleanup);

const setup = (props: Partial<Parameters<typeof TodoItemSample>[0]> = {}) => {
  const onToggle = vi.fn();
  render(
    <ul>
      <TodoItemSample
        itemID="todo-1"
        title="Buy milk"
        completed={false}
        onToggle={onToggle}
        {...props}
      />
    </ul>,
  );
  return { onToggle };
};

describe("TodoItemSample", () => {
  it("renders the title and a checkbox wired to itemID", () => {
    setup();

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "todo-1");
    expect(checkbox).toHaveAttribute("name", "todo-1");
  });

  it("calls onToggle(true) when an incomplete item is clicked", async () => {
    const { onToggle } = setup({ completed: false });

    await userEvent.click(screen.getByText("Buy milk"));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("calls onToggle(false) when a completed item is clicked", async () => {
    const { onToggle } = setup({ completed: true });

    await userEvent.click(screen.getByText("Buy milk"));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
