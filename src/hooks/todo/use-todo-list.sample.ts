/**
 *  With get data from API will use Tanstack Query for control server state.
 * But, in this project just simple todo list, so we just use basic store
 * @returns
 */

import { useCallback, useState } from "react";

// Types
import type { TodoItemSample, TodoItemSampleList } from "../../types/todo";

export const useTodoSampleList = () => {
  const [todos, setState] = useState<TodoItemSampleList>([]); // [] -> this is the value got from store. Also, we will replaced the store here

  const toggleTodo = useCallback(
    (id: TodoItemSample["id"]) => {
      const todoModified = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );

      setState(todoModified);
    },
    [todos],
  );

  return { todos, toggleTodo };
};
