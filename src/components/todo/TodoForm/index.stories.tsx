import type { Meta, StoryObj } from "@storybook/react-vite";

import { TodoForm } from "./index";

const meta = {
  title: "todo/TodoForm",
  component: TodoForm,
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-6 scheme-light">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onAdd: () => true },
};
