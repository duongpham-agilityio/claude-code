import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "storybook/test";

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
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Write plan" }),
    );
    await expect(args.onRemove).toHaveBeenCalledWith(
      "9b2f1c3a-5d4e-4f6a-8b7c-1d2e3f4a5b6c",
    );
  },
};
