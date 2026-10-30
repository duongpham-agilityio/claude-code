import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, spyOn, userEvent, within } from "storybook/test";

import { TodoItem } from "./index";

const meta = {
  title: "todo/TodoItem",
  component: TodoItem,
  args: {
    onToggle: fn(),
    onEdit: fn(),
    onRemove: fn(),
  },
  decorators: [
    (Story) => (
      <ul className="bg-gray-100 p-6">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof TodoItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotDone: Story = {
  args: {
    todo: {
      id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      title: "Learn React",
      done: false,
    },
  },
};

export const Done: Story = {
  args: {
    todo: {
      id: "9b2f1c3a-5d4e-4f6a-8b7c-1d2e3f4a5b6c",
      title: "Prototyping To-Do List",
      done: true,
    },
  },
};

export const Editing: Story = {
  args: {
    todo: {
      id: "0a1b2c3d-4e5f-4a6b-9c7d-8e9f0a1b2c3d",
      title: "Learn React",
      done: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /^edit/i }));
    await expect(
      canvas.getByRole("textbox", { name: "Todo title" }),
    ).toHaveValue("Learn React");
  },
};

export const Delete: Story = {
  args: {
    todo: {
      id: "44444444-4444-4444-8444-444444444444",
      title: "Learn React",
      done: false,
    },
  },
  play: async ({ canvasElement, args }) => {
    const confirmSpy = spyOn(window, "confirm").mockReturnValue(true);
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Learn React" }),
    );
    await expect(confirmSpy).toHaveBeenCalledWith(
      'Delete "Learn React"? This action cannot be undone.',
    );
    await expect(args.onRemove).toHaveBeenCalledWith(
      "44444444-4444-4444-8444-444444444444",
    );
    confirmSpy.mockRestore();
  },
};

export const DeleteCancelled: Story = {
  args: {
    todo: {
      id: "66666666-6666-4666-8666-666666666666",
      title: "Learn React",
      done: false,
    },
  },
  play: async ({ canvasElement, args }) => {
    const confirmSpy = spyOn(window, "confirm").mockReturnValue(false);
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Learn React" }),
    );
    await expect(confirmSpy).toHaveBeenCalledWith(
      'Delete "Learn React"? This action cannot be undone.',
    );
    await expect(args.onRemove).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  },
};

export const LongTitle: Story = {
  args: {
    todo: {
      id: "33333333-3333-4333-8333-333333333333",
      title: "a".repeat(200),
      done: false,
    },
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector("li")!;
    await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
  },
};

export const ClickTitleDoesNotToggle: Story = {
  args: {
    todo: {
      id: "55555555-5555-4555-8555-555555555555",
      title: "Learn React",
      done: false,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Learn React"));
    await expect(args.onToggle).not.toHaveBeenCalled();
  },
};

export const WithDragHandle: Story = {
  args: {
    todo: {
      id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      title: "Learn React",
      done: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Reorder Learn React" }),
    ).toBeVisible();
  },
};
