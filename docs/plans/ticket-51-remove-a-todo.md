# Remove a Todo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user delete a todo with a `Delete` button on its row; the todo disappears at once, and deleting the last one shows `No todos yet`.

**Architecture:** Same layering as add/update. A plain `removeTodo(todos, id)` function drops the matching todo and throws when the id is not in the list. A `removeTodo(id)` action in `useTodoStore` applies it. `useTodoList` wraps the action in try/catch and calls `window.alert(error.message)`, exactly like its `addTodo`. `TodoItem` already has a `Remove` button wired to `onRemove`; rename it to `Delete`, then forward `onRemove` through `TodoList` and `App`.

**Tech Stack:** React 19, TypeScript, Zustand 5, Tailwind 4, Vitest + Testing Library + user-event, Storybook.

**Spec:** `docs/analysis/ticket-51-remove-a-todo.md`

## Global Constraints

- Button visible text is exactly `Delete`; its accessible name is `Delete <todo title>` (via `aria-label`).
- No confirmation dialog; deletion is immediate.
- State lives only in `useTodoStore` (in-memory); no localStorage or backend.
- Removal logic is a plain function (no React, no Zustand) so it is unit tested without rendering.
- Id not in the list: the list stays unchanged and `window.alert` is shown with exactly `Could not delete the todo. Please try again.` (native dialog, closed by the user; no inline UI, no toast).
- Deleting the last todo shows `No todos yet` (already rendered by `TodoList`).
- Project rules (`CLAUDE.md`): `@/` imports across folders, `import type`, `interface FooProps` read via `props.x`, named arrow-function exports, Tailwind classes, `index.ts` re-exports, a `*.stories.tsx` per component, tests import from `vitest` and use `afterEach(cleanup)`, role queries, `userEvent`.
- Per the user's global rule, do not run `git commit`/`push` in any step.
- Per `CLAUDE.md` preview rule: after the UI change, run `preview_start` with the `storybook` config, check the `TodoItem` / `TodoList` stories, check console/logs, take a screenshot before reporting done.

## Review Focus

- Two todos with the same title: deleting one must remove only that one (match by `id`, not title).
- Deleting the first, middle and last todo keeps the order of the rest.
- Deleting a `done: true` todo works the same as an open one.
- Unknown id (e.g. already deleted): list unchanged, alert shown once, nothing thrown to React.
- Input array is not mutated by `removeTodo`.

---

### Task 1: `removeTodo` function, store action and hook handler

**Files:**
- Create: `src/stores/todo/remove-todo.ts`
- Create: `src/stores/todo/__test__/remove-todo.test.ts`
- Modify: `src/stores/todo/index.ts` (add `export * from "./remove-todo";`)
- Modify: `src/stores/todo/base.ts`, `src/stores/todo/__test__/base.test.ts`
- Modify: `src/hooks/todo/use-todo-list.ts`, `src/hooks/todo/__test__/use-todo-list.test.ts`

**Interfaces:**
- Produces:
  - `REMOVE_TODO_ERROR_MESSAGE = "Could not delete the todo. Please try again."` exported from `remove-todo.ts`.
  - `removeTodo(todos: Todo[], id: Todo["id"]): Todo[]` throws `Error(REMOVE_TODO_ERROR_MESSAGE)` when no todo has `id`.
  - `TodoState.removeTodo: (id: Todo["id"]) => void` (throws like the function).
  - `useTodoList()` additionally returns `removeTodo: (id: Todo["id"]) => void` which never throws.

- [ ] **Step 1: Write the failing function tests** in `remove-todo.test.ts` (fixtures `FIRST`, `SECOND` with the same title, as in `update-todo.test.ts`). Tests:
  - `"removes only the todo with the given id"`: `removeTodo([FIRST, SECOND], FIRST.id)` `toEqual([SECOND])`.
  - `"keeps the order of the remaining todos"`: three todos, remove the middle, expect first and last in order.
  - `"returns an empty array when the last todo is removed"`.
  - `"throws REMOVE_TODO_ERROR_MESSAGE when the id is not in the list"`: `toThrow(REMOVE_TODO_ERROR_MESSAGE)`.
  - `"does not mutate the input array"`: array length and items unchanged after the call.
- [ ] **Step 2: Run `pnpm test src/stores/todo/__test__/remove-todo.test.ts`.** Expected: FAIL, module/export not found.
- [ ] **Step 3: Implement `removeTodo` in `remove-todo.ts`** (filter by id; compare lengths to detect a missing id) and add the re-export to `index.ts`.
- [ ] **Step 4: Run the same command.** Expected: PASS.
- [ ] **Step 5: Add failing store test** in `base.test.ts`: `"removeTodo removes the todo from the store"` (set `todos: [TODO, OTHER]`, call `useTodoStore.getState().removeTodo(TODO.id)`, expect `[OTHER]`) and `"removeTodo throws and keeps todos when the id is unknown"` (`toThrow(REMOVE_TODO_ERROR_MESSAGE)`, todos still `[TODO]`). Run `pnpm test src/stores/todo`; expected FAIL.
- [ ] **Step 6: Add `removeTodo` to `TodoState` and the `create` body in `base.ts`**, using `set` with `removeTodo(state.todos, id)` as `updateTodo` does. Run `pnpm test src/stores/todo`; expected PASS.
- [ ] **Step 7: Add failing hook tests** in `use-todo-list.test.ts`:
  - `"removeTodo removes that todo only"`: store has `[TODO, other]`, `act(() => result.current.removeTodo(TODO.id))`, `todos` equals `[other]`, `alert` not called.
  - `"removeTodo alerts REMOVE_TODO_ERROR_MESSAGE and keeps the list when the id is unknown"`: spy `window.alert` with a no-op mock, call with `"missing-id"`, expect `alertSpy` called once with `REMOVE_TODO_ERROR_MESSAGE` and `todos` unchanged.
  Run `pnpm test src/hooks/todo`; expected FAIL.
- [ ] **Step 8: Implement `removeTodo` in `use-todo-list.ts`**: select `removeTodo` from the store in the `useShallow` selector, wrap in try/catch with the same `alert(error instanceof Error ? error.message : String(error))` as `addTodo`, return it. Run `pnpm test src/hooks/todo`; expected PASS.

### Task 2: `Delete` button UI and wiring

**Files:**
- Modify: `src/components/todo/TodoItem/index.tsx`, `index.test.tsx`, `index.stories.tsx`
- Modify: `src/components/todo/TodoList/index.tsx`, `index.test.tsx`, `index.stories.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `useTodoList().removeTodo: (id: Todo["id"]) => void` (Task 1).
- Produces: `TodoListProps.onRemove?: (id: Todo["id"]) => void`, forwarded to every `TodoItem`. `TodoItemProps.onRemove` already exists and is unchanged.

- [ ] **Step 1: Update `TodoItem` tests first** in `index.test.tsx`: replace the `/remove/i` queries with `/delete/i` (the "calls onRemove with the id when Delete is clicked" test and the "renders without callbacks" test), and add `"names the Delete button after the todo for screen readers"`: `screen.getByRole("button", { name: "Delete Learn React" })` has text content `Delete`. Run `pnpm test src/components/todo/TodoItem`; expected FAIL.
- [ ] **Step 2: In `TodoItem/index.tsx` change the button** to `aria-label={`Delete ${props.todo.title}`}` and visible text `Delete`. Run the same command; expected PASS.
- [ ] **Step 3: Add failing `TodoList` tests** in `index.test.tsx`: `"calls onRemove with the id of the row whose Delete was clicked"` (render `TODOS` with `onRemove={vi.fn()}`, click `Delete Done task`, expect `toHaveBeenCalledWith(TODOS[1].id)` and one call). Run `pnpm test src/components/todo/TodoList`; expected FAIL.
- [ ] **Step 4: Add `onRemove` to `TodoListProps`** and pass `onRemove={props.onRemove}` to `TodoItem` in `TodoList/index.tsx`. Run the same command; expected PASS.
- [ ] **Step 5: Add failing `App` tests** in `App.test.tsx` (use `userEvent.setup()` and seed with `useTodoStore.setState({ todos: [...] })` inside `act`, as the existing tests do):
  - `"deletes only the clicked todo"`: two todos with the same title `"Same"`; click the first `Delete Same` button; one `listitem` left and it is the second todo (assert via store state ids).
  - `"shows No todos yet after the last todo is deleted"`.
  The unknown-id alert is covered by the Task 1 hook test; no App-level test for it.
  Also fix the existing order test: its regex `/EditRemove$/` becomes `/EditDelete$/`. Run `pnpm test src/App.test.tsx`; expected FAIL.
- [ ] **Step 6: Wire `App.tsx`**: destructure `removeTodo` from `useTodoList()` and pass `onRemove={removeTodo}` to `TodoList`. Run `pnpm test`; expected all tests PASS.
- [ ] **Step 7: Stories.** `TodoItem` stories need no new story (existing `onRemove: fn()` arg stays). Add a `TodoItem` story `Delete` with a `play` that clicks `getByRole("button", { name: "Delete Learn React" })` and `expect(args.onRemove).toHaveBeenCalledWith(<that todo id>)`; add a `TodoList` story `WithRemove` passing `onRemove: fn()` and a `play` that clicks one `Delete` button and asserts the spy.
- [ ] **Step 8: Verify.** Run `pnpm lint` and `pnpm build`; expected: no errors. Then `preview_start` with the `storybook` config, open `todo/TodoItem` and `todo/TodoList` stories, confirm each row shows `Delete`, check console/logs for errors, take a screenshot. Also run the `dev` config once and delete a todo in the real app (add two, delete one, delete the last, see `No todos yet`).

## Self-Review

- Spec coverage: `Delete` button on each row (Task 2); immediate removal, no dialog (Tasks 1-2); removes only that todo and last-todo empty state (Task 2 App tests); plain unit-testable function (Task 1); `useTodoStore` only (Task 1); screen-reader label (Task 2); missing id alert with exact message (Task 1 hook test).
- Names consistent across tasks: `removeTodo`, `REMOVE_TODO_ERROR_MESSAGE`, `onRemove`.
