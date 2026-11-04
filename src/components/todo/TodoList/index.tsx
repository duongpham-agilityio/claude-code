// External libs
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
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
  // Index of the first visible todo in the full list. Indexes passed to
  // onReorder are relative to the visible todos.
  pageStart?: number;
  onEdit?: (id: Todo["id"], title: Todo["title"]) => void;
  onRemove?: (id: Todo["id"]) => void;
  onToggle?: (id: Todo["id"], done: boolean) => void;
  onReorder?: (pageStart: number, fromIndex: number, toIndex: number) => void;
}

const POINTER_ACTIVATION_DISTANCE = 5;

export const TodoList = (props: TodoListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const titleOf = (id: unknown): string =>
    props.todos.find((todo) => todo.id === id)?.title ?? "todo";

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const fromIndex = props.todos.findIndex((todo) => todo.id === active.id);
    const toIndex = props.todos.findIndex((todo) => todo.id === over.id);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    props.onReorder?.(props.pageStart ?? 0, fromIndex, toIndex);
  };

  if (props.todos.length === 0) {
    return <p className="text-gray-500">No todos yet</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
          onDragOver: ({ active, over }) =>
            over
              ? `${titleOf(active.id)} is over ${titleOf(over.id)}.`
              : undefined,
          onDragEnd: ({ active, over }) =>
            over
              ? `${titleOf(active.id)} was dropped over ${titleOf(over.id)}.`
              : `${titleOf(active.id)} was dropped.`,
          onDragCancel: ({ active }) =>
            `Reordering ${titleOf(active.id)} was cancelled.`,
        },
      }}
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
