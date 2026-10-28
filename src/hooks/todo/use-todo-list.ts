// External libs
import { useShallow } from "zustand/react/shallow";

// Stores
import { useTodoStore } from "@/stores/todo";

export const useTodoList = () => {
  const { todos, addTodo: addTodoToStore, updateTodo } = useTodoStore(
    useShallow((state) => ({
      todos: state.todos,
      addTodo: state.addTodo,
      updateTodo: state.updateTodo,
    })),
  );

  const addTodo = (title: string): boolean => {
    try {
      addTodoToStore(title);
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  return { todos, addTodo, updateTodo };
};
