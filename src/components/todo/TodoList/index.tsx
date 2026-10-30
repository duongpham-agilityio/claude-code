import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Components
import { TodoItem } from "@/components/todo/TodoItem";

// Types
import type { Todo } from "@/types/todo";

export interface TodoListProps {
  todos: Todo[];
  onEdit?: (id: Todo["id"], title: Todo["title"]) => void;
  onRemove?: (id: Todo["id"]) => void;
  onToggle?: (id: Todo["id"], done: boolean) => void;
  // Indexes are relative to `todos`
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export const TodoList = (props: TodoListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (props.todos.length === 0) {
    return <p className="text-gray-500">No todos yet</p>;
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    if (!event.over || event.active.id === event.over.id) {
      return;
    }

    const fromIndex = props.todos.findIndex(
      (todo) => todo.id === event.active.id,
    );
    const toIndex = props.todos.findIndex((todo) => todo.id === event.over?.id);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    props.onReorder?.(fromIndex, toIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={props.todos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-4">
          {props.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={props.onEdit}
              onRemove={props.onRemove}
              onToggle={props.onToggle}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
