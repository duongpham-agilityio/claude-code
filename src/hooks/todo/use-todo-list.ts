// Stores
import { useTodoStore } from "@/stores/todo";

export const useTodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  const addTodoToStore = useTodoStore((state) => state.addTodo);

  const addTodo = (title: string): boolean => {
    try {
      addTodoToStore(title);
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  return { todos, addTodo };
};
