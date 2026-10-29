# Ticket 90: Mark a todo as done — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking a todo's checkbox toggles its `done` state and shows it struck through. Clicking the title text does nothing.

**Architecture:** `TodoItem` already calls `onToggle(id, done)`; the chain below it is missing. Add a pure `toggleTodoDone` function (same pattern as `updateTodoTitle`), a `toggleTodo` store action, expose it from `useTodoList`, and pass `onToggle` through `App` and `TodoList` to `TodoItem`.

**Tech Stack:** React 19, TypeScript, Zustand 5, Vitest, Testing Library, Storybook.

**Spec:** `docs/bug-reports/ticket-90-cannot-mark-todo-done.md` (GitHub issue 90). Reporter answers: only change status to done; persistence is out of scope; checked box plus strike-through (already styled in `TodoItem`) is the expected look.

## Global Constraints

- Callback shape is fixed by `TodoItemProps`: `onToggle?: (id: Todo["id"], done: boolean) => void`.
- Project conventions: named arrow-function exports, `interface` for props read via `props.x`, `import type`, `@/` alias across folders, tests import from `vitest`, component tests use `afterEach(cleanup)` and role queries.
- No git commit/push steps in this plan (global rule); do not touch `*.sample.*` files.
- Every changed component keeps its `*.stories.tsx` current.

## Review Focus

- Toggling an unknown id leaves the list unchanged (no throw). Pinned in Task 1.
- Toggling one todo does not change others, including others with the same title. Pinned in Task 1.
- Toggling back (done → not done) works, since the checkbox is two-way. Pinned in Task 1.
- Toggling does not change title or order. Pinned in Task 1.
- Clicking the title text must not toggle (only the checkbox does). Pinned in Task 3.
- The checkbox keeps its accessible name (the title) once the title is no longer a `<label>`. Pinned in Task 3.
- Editing a done todo's title keeps it done (existing `updateTodoTitle` behavior). Already covered by `update-todo.test.ts` "keeps done and order"; no new test.

---

### Task 1: Store logic — `toggleTodoDone` and `toggleTodo` action

**Files:**
- Create: `src/stores/todo/toggle-todo.ts`
- Modify: `src/stores/todo/index.ts` (add `export * from "./toggle-todo";`)
- Modify: `src/stores/todo/base.ts` (`TodoState` + store)
- Test: `src/stores/todo/__test__/toggle-todo.test.ts` (new), `src/stores/todo/__test__/base.test.ts` (extend)

**Interfaces:**
- Produces: `toggleTodoDone(todos: Todo[], id: Todo["id"], done: boolean): Todo[]` (pure, returns a new array).
- Produces: `TodoState.toggleTodo: (id: Todo["id"], done: boolean) => void`.

- [ ] **Step 1: Write failing tests** in `toggle-todo.test.ts`, modeled on `update-todo.test.ts` (same `FIRST`/`SECOND` fixtures, `FIRST` not done, `SECOND` done, both titled "Same"). Tests, named by behavior:
  - `sets done on only the todo with the given id`: `toggleTodoDone([FIRST, SECOND], FIRST.id, true)` equals `[{ ...FIRST, done: true }, SECOND]`.
  - `can set a done todo back to not done`: `toggleTodoDone([FIRST, SECOND], SECOND.id, false)[1].done` is `false`.
  - `keeps title and order`: result ids equal `[FIRST.id, SECOND.id]`, titles unchanged.
  - `leaves the list unchanged for an unknown id`: `toggleTodoDone([FIRST, SECOND], "missing", true)` `toEqual([FIRST, SECOND])`.
  - `does not mutate the input`: input array and `FIRST.done` still `false` after the call.

  In `base.test.ts` add one test following that file's existing pattern: after `addTodo("Buy milk")`, `toggleTodo(id, true)` makes `useTodoStore.getState().todos[0].done` `true`.

- [ ] **Step 2: Run** `pnpm test src/stores/todo` — Expected: FAIL (`toggleTodoDone` not exported / `toggleTodo` not a function).

- [ ] **Step 3: Implement** `toggleTodoDone` in `toggle-todo.ts` with the signature above: `todos.map` replacing `done` only on the matching id (mirror `updateTodoTitle`). Export it from `index.ts`. In `base.ts` add `toggleTodo` to `TodoState` and to the store: `set((state) => ({ todos: toggleTodoDone(state.todos, id, done) }))`.

- [ ] **Step 4: Run** `pnpm test src/stores/todo` — Expected: PASS.

### Task 2: Hook — expose `toggleTodo` from `useTodoList`

**Files:**
- Modify: `src/hooks/todo/use-todo-list.ts` (select `toggleTodo` in the `useShallow` selector; add to the returned object)
- Test: `src/hooks/todo/__test__/use-todo-list.test.ts` (extend)

**Interfaces:**
- Consumes: `useTodoStore().toggleTodo` from Task 1.
- Produces: `useTodoList()` now returns `{ todos, addTodo, updateTodo, removeTodo, toggleTodo }`, `toggleTodo: (id: Todo["id"], done: boolean) => void`.

- [ ] **Step 1: Write failing test** `toggleTodo marks the todo as done`: seed the store with `TODO` via `useTodoStore.setState({ todos: [TODO] })`, `renderHook(() => useTodoList())`, `act(() => result.current.toggleTodo(TODO.id, true))`, expect `result.current.todos[0].done` `true`. Follow the file's existing seeding style.
- [ ] **Step 2: Run** `pnpm test src/hooks/todo` — Expected: FAIL (`toggleTodo` undefined).
- [ ] **Step 3: Implement** as described under Files. Return `toggleTodo` as is (no try/catch: it cannot throw).
- [ ] **Step 4: Run** `pnpm test src/hooks/todo` — Expected: PASS.

### Task 3: `TodoItem` — only the checkbox toggles

Today the title is a `<label htmlFor={id}>`, so clicking the text would also toggle the checkbox. Reporter wants only the checkbox to toggle.

**Files:**
- Modify: `src/components/todo/TodoItem/index.tsx` (checkbox + title)
- Modify: `src/components/todo/TodoItem/index.stories.tsx` (add story `ClickTitleDoesNotToggle`)
- Test: `src/components/todo/TodoItem/index.test.tsx` (extend)

**Interfaces:**
- Produces: same `TodoItemProps`; the checkbox always has `aria-label={props.todo.title}`; the non-editing title is a `<span>` (keeps `title` attr and `titleClass`), not a `<label>`.

- [ ] **Step 1: Write failing test** `does not call onToggle when the title text is clicked`: render `<TodoItem todo={...} onToggle={onToggle} />` (`vi.fn()`), `await userEvent.click(screen.getByText("Learn React"))`, expect `onToggle` not called and `getByRole("checkbox", { name: "Learn React" })` still unchecked.
- [ ] **Step 2: Run** `pnpm test src/components/todo/TodoItem` — Expected: FAIL (`onToggle` called once via the label).
- [ ] **Step 3: Implement** in `index.tsx`: replace the non-editing `<label htmlFor=...>` with a `<span>` carrying the same `title` and `className`; drop the checkbox `id`; set `aria-label={props.todo.title}` unconditionally (was only while editing). Existing tests that find the checkbox by name "Learn React" keep passing.
- [ ] **Step 4: Run** `pnpm test src/components/todo/TodoItem` — Expected: PASS, including the existing "renders the title as the label of an unchecked checkbox" and strike-through tests. Add the story with a `play` that clicks the title text and asserts `args.onToggle` not.toHaveBeenCalled.

### Task 4: UI wiring — `TodoList` and `App`

**Files:**
- Modify: `src/components/todo/TodoList/index.tsx` (add `onToggle?: (id: Todo["id"], done: boolean) => void;` to `TodoListProps`; pass `onToggle={props.onToggle}` to `TodoItem`)
- Modify: `src/App.tsx:8,14` (destructure `toggleTodo`; pass `onToggle={toggleTodo}`)
- Modify: `src/components/todo/TodoList/index.stories.tsx` (add story `WithToggle`)
- Test: `src/components/todo/TodoList/index.test.tsx` (extend)

**Interfaces:**
- Consumes: `useTodoList().toggleTodo` from Task 2; `TodoItem` from Task 3.

- [ ] **Step 1: Write failing test** in `TodoList/index.test.tsx`: `calls onToggle with the id and the new checked state` — render `<TodoList todos={TODOS} onToggle={onToggle} />` with `onToggle = vi.fn()`, `await userEvent.click(screen.getByRole("checkbox", { name: "Open task" }))`, expect `onToggle` toHaveBeenCalledWith `("7c9e6679-7425-40de-944b-e07fc1f90ae7", true)`. Add a second: clicking the checked "Done task" checkbox calls `onToggle` with `("9b2f1c3a-5d4e-4f6a-8b7c-1d2e3f4a5b6c", false)`.
- [ ] **Step 2: Run** `pnpm test src/components/todo/TodoList` — Expected: FAIL (`onToggle` not called).
- [ ] **Step 3: Implement** the prop pass-through and the `App.tsx` wiring as listed under Files. Add story `WithToggle` modeled on `WithRemove`: `args` with the same todos plus `onToggle: fn()`, `play` clicks checkbox "Buy milk" and asserts `args.onToggle` toHaveBeenCalledWith `("7c9e6679-7425-40de-944b-e07fc1f90ae7", true)`.
- [ ] **Step 4: Run** `pnpm test` — Expected: all unit tests PASS. Then `pnpm lint` and `pnpm build` — Expected: no errors.
- [ ] **Step 5: Preview check (project Preview rule).** `preview_start` config `storybook`, open story `todo/TodoList` → `WithToggle`, confirm the play function passes and the console has no errors; screenshot. Then `preview_start` config `dev`: add `Buy milk`, click the title text, expect nothing changes; click its checkbox, expect `checked === true` and the title has class `line-through`; click the checkbox again, expect unchecked and no `line-through`. Take a screenshot, then `preview_stop` both servers.

## Self-review notes

- Coverage: reproduction step 3 of the bug report is fixed by the wiring in Task 4; expected result (checked + strike-through) verified in Step 5. Persistence and extra visuals are out of scope per reporter answers.
- Types: `toggleTodoDone` / `toggleTodo` / `onToggle` all use `(id: Todo["id"], done: boolean)`.
