import { useState } from "react";

// External libs
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Types
import type { Todo } from "@/types/todo";

export interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: Todo["id"], done: boolean) => void;
  onEdit?: (id: Todo["id"], title: Todo["title"]) => void;
  onRemove?: (id: Todo["id"]) => void;
}

// Title text and input share this box (border, padding, line height) so switching
// between them does not change the row height.
const TITLE_BOX_CLASS =
  "min-w-32 flex-1 truncate rounded border px-2 py-1 text-lg leading-7";

const BUTTON_CLASS =
  "rounded px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-40";

export const TodoItem = (props: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(props.todo.title);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.todo.id });

  const trimmedDraft = draft.trim();
  const canSave = trimmedDraft.length > 0;

  const startEdit = () => {
    setDraft(props.todo.title);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(props.todo.title);
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!canSave) {
      return;
    }
    props.onEdit?.(props.todo.id, trimmedDraft);
    setIsEditing(false);
  };

  const handleRemove = (): void => {
    const message = `Delete "${props.todo.title}"? This action cannot be undone.`;
    if (window.confirm(message)) {
      props.onRemove?.(props.todo.id);
    }
  };

  const titleClass = `${TITLE_BOX_CLASS} border-transparent ${
    props.todo.done ? "line-through text-gray-500" : "text-gray-900"
  }`;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative flex flex-wrap items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-md scheme-light ${
        isDragging ? "z-10 opacity-80 shadow-xl" : ""
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label={`Reorder ${props.todo.title}`}
        className="-ml-3 shrink-0 cursor-grab touch-none rounded px-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-gray-900 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-5"
          fill="currentColor"
        >
          <circle cx="6" cy="3.5" r="1.25" />
          <circle cx="10" cy="3.5" r="1.25" />
          <circle cx="6" cy="8" r="1.25" />
          <circle cx="10" cy="8" r="1.25" />
          <circle cx="6" cy="12.5" r="1.25" />
          <circle cx="10" cy="12.5" r="1.25" />
        </svg>
      </button>
      <input
        type="checkbox"
        aria-label={props.todo.title}
        checked={props.todo.done}
        onChange={(event) =>
          props.onToggle?.(props.todo.id, event.target.checked)
        }
        className="size-5 shrink-0 accent-gray-900"
      />
      {isEditing ? (
        <input
          type="text"
          aria-label="Todo title"
          value={draft}
          autoFocus
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              saveEdit();
            } else if (event.key === "Escape") {
              cancelEdit();
            }
          }}
          className={`${TITLE_BOX_CLASS} border-gray-300 text-gray-900`}
        />
      ) : (
        <span title={props.todo.title} className={titleClass}>
          {props.todo.title}
        </span>
      )}
      <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              disabled={!canSave}
              onClick={saveEdit}
              className={BUTTON_CLASS}
            >
              Save
            </button>
            <button type="button" onClick={cancelEdit} className={BUTTON_CLASS}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-label={`Edit ${props.todo.title}`}
            onClick={startEdit}
            className={BUTTON_CLASS}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          aria-label={`Delete ${props.todo.title}`}
          onClick={handleRemove}
          className={BUTTON_CLASS}
        >
          Delete
        </button>
      </div>
    </li>
  );
};
