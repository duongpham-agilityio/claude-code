import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Todo } from "@/types/todo";

import { TodoItem } from "./index";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const mockConfirm = (answer: boolean) =>
  vi.spyOn(window, "confirm").mockReturnValue(answer);

const TODO: Todo = {
  id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  title: "Learn React",
  done: false,
};

const setup = (todo: Todo = TODO) => {
  const onToggle = vi.fn();
  const onEdit = vi.fn();
  const onRemove = vi.fn();
  render(
    <ul>
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    </ul>,
  );
  return { onToggle, onEdit, onRemove };
};

describe("TodoItem", () => {
  it("renders the title as the label of an unchecked checkbox", () => {
    setup();

    expect(
      screen.getByRole("checkbox", { name: "Learn React" }),
    ).not.toBeChecked();
  });

  it("checks the checkbox and strikes through the title when done", () => {
    setup({ ...TODO, done: true });

    expect(screen.getByRole("checkbox", { name: "Learn React" })).toBeChecked();
    expect(screen.getByText("Learn React")).toHaveClass("line-through");
  });

  it("does not strike through the title when not done", () => {
    setup();

    expect(screen.getByText("Learn React")).not.toHaveClass("line-through");
  });

  it("calls onToggle with the id and the next done value", async () => {
    const { onToggle } = setup();

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith(TODO.id, true);
  });

  it("does not call onToggle when the title text is clicked", async () => {
    const { onToggle } = setup();

    await userEvent.click(screen.getByText("Learn React"));

    expect(onToggle).not.toHaveBeenCalled();
    expect(
      screen.getByRole("checkbox", { name: "Learn React" }),
    ).not.toBeChecked();
  });

  it("switches to an input with the title plus Save and Cancel when Edit is clicked", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByRole("textbox", { name: "Todo title" })).toHaveValue(
      "Learn React",
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^edit/i })).toBeNull();
  });

  it("calls onEdit with the id and trimmed new title on Save, then leaves edit mode", async () => {
    const { onEdit } = setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByRole("textbox", { name: "Todo title" });
    await userEvent.clear(input);
    await userEvent.type(input, "  Learn Vite  ");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onEdit).toHaveBeenCalledWith(TODO.id, "Learn Vite");
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("saves with Enter", async () => {
    const { onEdit } = setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.type(screen.getByRole("textbox"), "!{Enter}");

    expect(onEdit).toHaveBeenCalledWith(TODO.id, "Learn React!");
  });

  it("discards changes on Cancel and shows the original title", async () => {
    const { onEdit } = setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.type(screen.getByRole("textbox"), " changed");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText("Learn React")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("textbox")).toHaveValue("Learn React");
  });

  it("cancels with Escape", async () => {
    const { onEdit } = setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.type(screen.getByRole("textbox"), "x{Escape}");

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("disables Save when the title is blank", async () => {
    const { onEdit } = setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.clear(screen.getByRole("textbox"));
    await userEvent.type(screen.getByRole("textbox"), "   ");

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    await userEvent.keyboard("{Enter}");
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("calls onRemove with the id when Delete is clicked", async () => {
    mockConfirm(true);
    const { onRemove } = setup();

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onRemove).toHaveBeenCalledWith(TODO.id);
  });

  it("asks for confirmation with the todo title before deleting", async () => {
    const confirmSpy = mockConfirm(true);
    setup();

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(confirmSpy).toHaveBeenCalledWith(
      'Delete "Learn React"? This action cannot be undone.',
    );
  });

  it("does not call onRemove when the user cancels the confirmation", async () => {
    mockConfirm(false);
    const { onRemove } = setup();

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onRemove).not.toHaveBeenCalled();
    expect(screen.getByText("Learn React")).toBeInTheDocument();
  });

  it("confirms and removes while editing, using the saved title not the draft", async () => {
    const confirmSpy = mockConfirm(true);
    const { onRemove } = setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.type(screen.getByRole("textbox"), "x");
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalledWith(
      'Delete "Learn React"? This action cannot be undone.',
    );
    expect(onRemove).toHaveBeenCalledWith(TODO.id);
  });

  it("keeps edit mode and the draft when deletion is cancelled while editing", async () => {
    mockConfirm(false);
    const { onRemove } = setup();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.type(screen.getByRole("textbox"), "x");
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onRemove).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("Learn Reactx");
  });

  it("passes quotes in the title through to the confirmation message", async () => {
    const confirmSpy = mockConfirm(true);
    setup({ ...TODO, title: 'Say "hi"' });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalledWith(
      'Delete "Say "hi""? This action cannot be undone.',
    );
  });

  it("names the Delete button after the todo for screen readers", () => {
    setup();

    expect(
      screen.getByRole("button", { name: "Delete Learn React" }),
    ).toHaveTextContent(/^Delete$/);
  });

  it("renders without callbacks and does not throw on click", async () => {
    mockConfirm(true);
    render(
      <ul>
        <TodoItem todo={TODO} />
      </ul>,
    );

    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });
});
