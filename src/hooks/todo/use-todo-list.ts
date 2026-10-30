// External libs
import { useShallow } from "zustand/react/shallow";

// Constants
import { TODO_PAGE_SIZE } from "@/constants";

// Stores
import { paginateTodos, useTodoStore } from "@/stores/todo";

// Types
import type { Todo } from "@/types/todo";

export const useTodoList = () => {
  const {
    todos,
    currentPage: storedPage,
    setPage,
    addTodo: addTodoToStore,
    updateTodo,
    removeTodo: removeTodoFromStore,
    toggleTodo,
  } = useTodoStore(
    useShallow((state) => ({
      todos: state.todos,
      currentPage: state.currentPage,
      setPage: state.setPage,
      addTodo: state.addTodo,
      updateTodo: state.updateTodo,
      removeTodo: state.removeTodo,
      toggleTodo: state.toggleTodo,
    })),
  );

  const {
    items: pagedTodos,
    page: currentPage,
    totalPages,
  } = paginateTodos(todos, storedPage, TODO_PAGE_SIZE);

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
  };
};
