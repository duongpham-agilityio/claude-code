// External libs
import { useShallow } from "zustand/react/shallow";

// Constants
import { TODO_PAGE_SIZE } from "@/constants";

// Hooks
import { usePagination } from "@/hooks/shared";

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
    reorderTodo: reorderTodoInStore,
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

  const {
    pagedItems: pagedTodos,
    currentPage,
    totalPages,
    setPage,
    resetPage,
  } = usePagination(todos, TODO_PAGE_SIZE);

  const addTodo = (title: string): boolean => {
    try {
      addTodoToStore(title);
      // New todos go to the top of the list, so show page 1
      resetPage();
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  // Indexes are relative to the visible page; the store needs the page offset
  const reorderTodo = (fromIndex: number, toIndex: number): void => {
    const pageStart = (currentPage - 1) * TODO_PAGE_SIZE;

    reorderTodoInStore(pageStart, fromIndex, toIndex);
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
