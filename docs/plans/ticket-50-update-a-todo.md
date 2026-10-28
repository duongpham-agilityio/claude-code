# Update a Todo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user edit a todo's title from its row (`Edit` → input → `Save` / `Cancel`) and have `Save` update only that todo in the list.

**Architecture:** `TodoItem` already renders the edit UI and calls `onEdit(id, title)` with a trimmed, non-empty title. The missing part is state: a plain `updateTodoTitle(todos, id, title)` function (trim, change only the matching todo), a Zustand store action `updateTodo(id, title)` that applies it, and a `useTodoList` handler that passes it through. `TodoList` forwards `onEdit` to each `TodoItem`; `App` wires the hook to it.

**Tech Stack:** React 19, TypeScript, Zustand 5, Tailwind 4, Vitest + Testing Library + user-event, Storybook.

**Spec:** `docs/analysis/ticket-50-update-a-todo.md`

## Global Constraints

- Title is trimmed before saving; `done` and `id` of the edited todo are untouched.
- Empty / whitespace-only title is blocked by `TodoItem` only (`Save` disabled, Enter ignored). The update function, store and hook do no validation: no throw, no `alert`, no `Title is required`.
- Saving an unchanged title is a normal save. No handling for an unknown id (local-only data), and none for several rows in edit mode.
- `TodoItem` keeps Enter = Save and Escape = Cancel as is; no new tests for them.
- Position of the edited todo in the list does not change.
- Project rules (`CLAUDE.md`): `@/` imports across folders, `import type`, `interface FooProps` read via `props.x`, named arrow-function exports, Tailwind classes, `index.ts` re-exports, a `*.stories.tsx` per component, tests import from `vitest` and use `afterEach(cleanup)`, role queries, `userEvent`.
- Per the user's global rule, do not run `git commit`/`push` in any step.
- Per `CLAUDE.md` preview rule: after the UI change, run `preview_start` with the `storybook` config, check the affected story, check console/logs, take a screenshot before reporting done.

## Review Focus

- Todo with the same title as another: editing one must not change the other (match by `id`, not title).
- Edited todo is `done: true`: it stays done after the edit.
- Title with surrounding spaces (`"  New  "`): stored as `"New"`.
- Editing the first/last todo: order of the list is unchanged.

---

### Task 1: `updateTodoTitle` function and store action

**Files:**
- Create: `src/stores/todo/update-todo.ts`
- Create: `src/stores/todo/__test__/update-todo.test.ts`
- Modify: `src/stores/todo/index.ts` (add `export * from "./update-todo";`)
- Modify: `src/stores/todo/base.ts`
- Modify: `src/stores/todo/__test__/base.test.ts`

**Interfaces:**
- Produces: `updateTodoTitle(todos: Todo[], id: Todo["id"], title: string): Todo[]` (new array, only the todo with `id` gets the trimmed title).
- Produces: `TodoState.updateTodo: (id: Todo["id"], title: Todo["title"]) => void`.

- [ ] **Step 1: Write the failing unit tests** in `update-todo.test.ts` (imports from `@/stores/todo`), with fixtures `FIRST` (`done: false`), `SECOND` (`done: true`, same title as `FIRST` for the duplicate case):
  - `"changes only the todo with the given id"`: `updateTodoTitle([FIRST, SECOND], FIRST.id, "New")` → `[{ ...FIRST, title: "New" }, SECOND]`.
  - `"trims the title"`: `updateTodoTitle([FIRST], FIRST.id, "  New  ")[0].title` is `"New"`.
  - `"keeps done and order"`: updating `SECOND` returns `done: true` and the same index.
  - `"does not change the todo with the same title"`: duplicate titles, only the one with the given id changes.
  - `"does not mutate the input array"`: original `FIRST.title` unchanged.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/stores/todo/__test__/update-todo.test.ts`
Expected: FAIL (`updateTodoTitle` is not exported).

- [ ] **Step 3: Implement `updateTodoTitle`** in `update-todo.ts`: trim, then `todos.map` replacing only the matching id. Add the re-export in `index.ts`.

- [ ] **Step 4: Add a failing store test** in `base.test.ts`: `"updateTodo changes the title of the matching todo only"`: two todos, update one, assert titles in order.

- [ ] **Step 5: Implement the action**: add `updateTodo: (id: Todo["id"], title: Todo["title"]) => void` to `TodoState` and to the store: `set((state) => ({ todos: updateTodoTitle(state.todos, id, title) }))`.

- [ ] **Step 6: Run to verify pass**

Run: `pnpm test src/stores/todo`
Expected: PASS.

### Task 2: Expose `updateTodo` in `useTodoList`

**Files:**
- Modify: `src/hooks/todo/use-todo-list.ts`
- Modify: `src/hooks/todo/__test__/use-todo-list.test.ts`

**Interfaces:**
- Consumes: `useTodoStore` state `updateTodo(id, title)` from Task 1.
- Produces: `useTodoList()` returns `{ todos, addTodo, updateTodo }` with `updateTodo: (id: Todo["id"], title: Todo["title"]) => void` (the store action, unwrapped).

- [ ] **Step 1: Write a failing test** in `use-todo-list.test.ts`: `"updateTodo changes the title of that todo only"`: store has `[TODO, other]`, call `result.current.updateTodo(TODO.id, "  Buy bread  ")`, assert titles `["Buy bread", other.title]` and that `done` of both is unchanged.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/hooks/todo/__test__/use-todo-list.test.ts`
Expected: FAIL (`updateTodo` is not a function).

- [ ] **Step 3: Implement**: read `updateTodo` from the store (selector, like `addTodoToStore`) and add it to the returned object.

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/hooks/todo`
Expected: PASS.

### Task 3: Wire `TodoList` and `App`, add story, preview

**Files:**
- Modify: `src/components/todo/TodoList/index.tsx`
- Modify: `src/components/todo/TodoList/index.test.tsx`
- Modify: `src/components/todo/TodoList/index.stories.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useTodoList().updateTodo` from Task 2.
- Produces: `TodoListProps.onEdit?: (id: Todo["id"], title: Todo["title"]) => void`, passed to every `TodoItem` as `onEdit`.

- [ ] **Step 1: Write failing component tests** in `TodoList/index.test.tsx` (using `userEvent`, `vi.fn()`):
  - `"calls onEdit with the id of the edited todo and the trimmed new title"`: render `TODOS` with `onEdit`, click `Edit Another task`, clear and type `"  Renamed  "` in the `Todo title` textbox, click `Save`; expect `onEdit` called once with `("0a1b2c3d-4e5f-4a6b-9c7d-8e9f0a1b2c3d", "Renamed")`.
  - `"does not call onEdit on Cancel"`: edit then click `Cancel`; expect `onEdit` not called and the original title shown.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/todo/TodoList`
Expected: FAIL (`onEdit` never called because `TodoList` does not forward it).

- [ ] **Step 3: Implement**: add optional `onEdit` to `TodoListProps` and pass `onEdit={props.onEdit}` to `TodoItem`. In `App.tsx` destructure `updateTodo` and pass `onEdit={updateTodo}` to `TodoList`.

- [ ] **Step 4: Add a story** `Editable` in `TodoList/index.stories.tsx` with `args: { todos: <the Mixed todos>, onEdit: fn() }` (`fn` from `storybook/test`, as in `TodoItem/index.stories.tsx`).

- [ ] **Step 5: Run the full checks**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: all PASS with no errors.

- [ ] **Step 6: Preview (required by `CLAUDE.md`)**: `preview_start` with the `storybook` config, open `todo/TodoList` → `Editable`, click `Edit`, change the title, `Save`; check the title changes in the row (the story is controlled by args, so also verify with the `dev` config: add two todos, edit one, confirm only that one changes, blank title disables `Save`). Check console/logs for errors and take a screenshot.

---

## Self-Review

- Spec coverage: Edit input prefilled, Save/Cancel, empty title blocked (existing `TodoItem`, covered by its tests) → Tasks 1-3 add the missing update, trim, only-that-todo, and wiring; unit (update function), component (edit+save, edit+cancel) tests present; blank-title component test already exists in `TodoItem/index.test.tsx`.
- Types: `updateTodoTitle`, `updateTodo`, `onEdit` signatures match across tasks.
