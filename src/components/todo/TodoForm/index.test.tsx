import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TodoForm } from "./index";

afterEach(cleanup);

describe("TodoForm", () => {
  it("disables Add while the input is empty or whitespace-only", async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={vi.fn()} />);

    const add = screen.getByRole("button", { name: "Add" });
    expect(add).toBeDisabled();

    await user.type(screen.getByRole("textbox", { name: "New todo" }), "   ");
    expect(add).toBeDisabled();

    await user.type(screen.getByRole("textbox", { name: "New todo" }), "a");
    expect(add).toBeEnabled();
  });

  it("adds the typed title when Add is clicked, then clears the input and keeps focus on it", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockReturnValue(true);
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByRole("textbox", { name: "New todo" });
    await user.type(input, "Buy milk");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).toHaveBeenCalledWith("Buy milk");
    expect(input).toHaveValue("");
    expect(input).toBe(document.activeElement);
  });

  it("adds the typed title when Enter is pressed", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockReturnValue(true);
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByRole("textbox", { name: "New todo" });
    await user.type(input, "Buy milk{Enter}");

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith("Buy milk");
    expect(input).toHaveValue("");
  });

  it("does nothing when Enter is pressed with a whitespace-only title", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockReturnValue(true);
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByRole("textbox", { name: "New todo" });
    await user.type(input, "   {Enter}");

    expect(onAdd).not.toHaveBeenCalled();
    expect(input).toHaveValue("   ");
  });

  it("keeps the typed value when onAdd returns false", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockReturnValue(false);
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByRole("textbox", { name: "New todo" });
    await user.type(input, "Buy milk");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).toHaveBeenCalledWith("Buy milk");
    expect(input).toHaveValue("Buy milk");
  });
});
