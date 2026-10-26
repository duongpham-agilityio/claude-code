// Stores
import { useTodoStore } from "@/stores/todo";

export const useTodoList = () => {
  const todos = useTodoStore((state) => state.todos);

  return { todos };
};
