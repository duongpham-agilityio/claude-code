# Bug: Cannot mark a todo as done (checkbox click has no effect)
Status: REPRODUCED

## Environment
- Branch / commit: develop @ 5afdc09
- Versions: Node v22.22.2, pnpm 10.33.0, Vite dev server on port 5173; OS: macOS (Darwin 23.6.0); browser: Claude desktop built-in browser pane
- Source: GitHub issue 90 ("Cannot mark a todo as done", label `bug`), fetched with `gh issue view 90`

## Setup
1. `preview_start` with config `dev` (`pnpm dev`, port 5173).
2. Open http://localhost:5173/ and confirm the page loads (heading "Todo Practice", input "New todo", button "Add").
3. Server stopped with `preview_stop` after the runs.
Setup notes: none

## Steps to reproduce
1. Open http://localhost:5173/.
2. Type `Buy milk` in the "New todo" input (placeholder "What needs to be done?") and press Enter. Todo "Buy milk" appears with an unchecked checkbox.
3. Click the checkbox of "Buy milk".

Reproduced: always (2 of 2 runs: once by clicking the checkbox, once by clicking the label)

## Expected
Todo is toggled to done: checkbox checked, title shown struck through (`line-through text-gray-500`).

## Actual
Nothing changes. Checkbox stays unchecked (`checked === false`), label class stays `... border-transparent text-gray-900` (no `line-through`). Same result when clicking the label.

## Evidence
- DOM after click: `{"checked": false, "labelClass": "min-w-32 flex-1 truncate rounded border px-2 py-1 text-lg leading-7 border-transparent text-gray-900"}`
- Console errors: none (`read_console_messages` onlyErrors: "No console logs.")

## Suspected area
Failing step: 3
Files:
```tsx
// src/App.tsx:14
<TodoList todos={todos} onEdit={updateTodo} onRemove={removeTodo} />
```
```tsx
// src/components/todo/TodoList/index.tsx:18-24
<TodoItem
  key={todo.id}
  todo={todo}
  onEdit={props.onEdit}
  onRemove={props.onRemove}
/>
```
```ts
// src/stores/todo/update-todo.ts:11-13 (only the title is updated; no `done` update found)
return todos.map((todo) =>
  todo.id === id ? { ...todo, title: trimmed } : todo,
);
```
Why: `TodoItem` calls `props.onToggle?.(...)` on checkbox change (`src/components/todo/TodoItem/index.tsx`, optional call). `TodoList` has no `onToggle` prop and does not pass one to `TodoItem`; `App.tsx` passes none; `useTodoList` returns no toggle function. Grep for `onToggle|toggle` in non-sample, non-story source found only `TodoItem`. The optional call is a silent no-op, consistent with no console error. The controlled checkbox (`checked={props.todo.done}`) then reverts to unchecked. This is a suspicion, not a proven root cause.

## Questions for the reporter
1. Is "done" meant to persist across page reload? Assumption: not tested, in-memory behavior only.
2. Should done todos be visually distinct beyond strike-through (e.g. moved/filtered)? Assumption: strike-through plus checked box, as `TodoItem` already styles it.

## Answers for questions
1. Just change todo's status to done. Don't care about persist or not. Focus on this bug
2. Your assunption is correct
