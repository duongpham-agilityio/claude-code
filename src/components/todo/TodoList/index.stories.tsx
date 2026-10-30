import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, spyOn, userEvent, within } from "storybook/test";

import { TodoList } from "./index";

const meta = {
  title: "todo/TodoList",
  component: TodoList,
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-6 scheme-light">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodoList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { todos: [] },
};

export const Mixed: Story = {
  args: {
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
  },
};

export const Editable: Story = {
  args: {
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
    onEdit: fn(),
  },
};

export const WithRemove: Story = {
  args: {
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
    onRemove: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const confirmSpy = spyOn(window, "confirm").mockReturnValue(true);
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Write plan" }),
    );
    await expect(args.onRemove).toHaveBeenCalledWith(
      "9b2f1c3a-5d4e-4f6a-8b7c-1d2e3f4a5b6c",
    );
    confirmSpy.mockRestore();
  },
};

export const WithToggle: Story = {
  args: {
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
    onToggle: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Buy milk" }));
    await expect(args.onToggle).toHaveBeenCalledWith(
      "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      true,
    );
  },
};

export const Reorderable: Story = {
  args: {
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
    onReorder: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Reorder Buy milk" }),
    );
    await userEvent.keyboard(" ");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard(" ");
    await expect(args.onReorder).toHaveBeenCalledWith(0, 1);
  },
};
