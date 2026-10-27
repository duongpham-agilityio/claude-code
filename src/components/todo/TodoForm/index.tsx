import { useRef, useState } from "react";
import type { SyntheticEvent } from "react";

export interface TodoFormProps {
  onAdd: (title: string) => boolean;
}

const BUTTON_CLASS =
  "rounded px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-40";

export const TodoForm = (props: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const canAdd = title.trim().length > 0;

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAdd) {
      return;
    }
    // Keep the typed value when adding fails.
    if (props.onAdd(title)) {
      setTitle("");
      inputRef.current?.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-md scheme-light"
    >
      <input
        ref={inputRef}
        type="text"
        aria-label="New todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="min-w-32 flex-1 rounded border border-gray-300 px-2 py-1 text-lg leading-7 text-gray-900"
      />
      <button type="submit" disabled={!canAdd} className={BUTTON_CLASS}>
        Add
      </button>
    </form>
  );
};
