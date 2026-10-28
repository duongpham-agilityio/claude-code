// Components
import { TodoItem } from "@/components/todo/TodoItem";

// Types
import type { Todo } from "@/types/todo";

export interface TodoListProps {
  todos: Todo[];
  onEdit?: (id: Todo["id"], title: Todo["title"]) => void;
}

export const TodoList = (props: TodoListProps) => {
  if (props.todos.length === 0) {
    return <p className="text-gray-500">No todos yet</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {props.todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={props.onEdit} />
      ))}
    </ul>
  );
};
