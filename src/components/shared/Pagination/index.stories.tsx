import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "storybook/test";

import { Pagination } from "./index";

const meta = {
  title: "shared/Pagination",
  component: Pagination,
  args: { onPageChange: fn() },
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-6 scheme-light">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FewPages: Story = {
  args: { currentPage: 2, totalPages: 3 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(args.onPageChange).toHaveBeenCalledWith(3);
  },
};

export const ManyPages: Story = {
  args: { currentPage: 6, totalPages: 12 },
};

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Prev" })).toBeDisabled();
  },
};

export const LastPage: Story = {
  args: { currentPage: 5, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled();
  },
};
