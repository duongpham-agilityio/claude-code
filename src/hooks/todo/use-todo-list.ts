// External libs
import { useShallow } from "zustand/react/shallow";

// Stores
import { paginateTodos, useTodoStore } from "@/stores/todo";

// Types
import type { Todo } from "@/types/todo";

export const useTodoList = () => {
  const {
    todos,
    page,
    setPage,
    addTodo: addTodoToStore,
    updateTodo,
    removeTodo: removeTodoFromStore,
    toggleTodo,
    reorderTodo,
  } = useTodoStore(
    useShallow((state) => ({
      todos: state.todos,
      page: state.currentPage,
      setPage: state.setPage,
      addTodo: state.addTodo,
      updateTodo: state.updateTodo,
      removeTodo: state.removeTodo,
      toggleTodo: state.toggleTodo,
      reorderTodo: state.reorderTodo,
    })),
  );

  const { pagedTodos, currentPage, totalPages } = paginateTodos(todos, page);

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

  return {
    todos,
    pagedTodos,
    currentPage,
    totalPages,
    setPage,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    reorderTodo,
  };
};
