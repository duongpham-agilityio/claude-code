// External libs
import { useShallow } from "zustand/react/shallow";

// Stores
import { useTodoStore } from "@/stores/todo";

// Types
import type { Todo } from "@/types/todo";

export const useTodoList = () => {
  const {
    todos,
    addTodo: addTodoToStore,
    updateTodo,
    removeTodo: removeTodoFromStore,
    toggleTodo,
    reorderTodo,
  } = useTodoStore(
    useShallow((state) => ({
      todos: state.todos,
      addTodo: state.addTodo,
      updateTodo: state.updateTodo,
      removeTodo: state.removeTodo,
      toggleTodo: state.toggleTodo,
      reorderTodo: state.reorderTodo,
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

  const removeTodo = (id: Todo["id"]): void => {
    try {
      removeTodoFromStore(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
    }
  };

  return { todos, addTodo, updateTodo, removeTodo, toggleTodo, reorderTodo };
};
