# Add a New Todo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user type a title in an input above the todo list and add it (click `Add` or Enter), with the new todo shown first.

**Architecture:** A plain `createTodo(title)` function builds and validates the `Todo`. A Zustand store action `addTodo(title)` prepends it. `useTodoList` exposes a handler that wraps the action in `try/catch` (`alert` on error) and reports success. A new `TodoForm` component owns the input and `Add` button; `App` wires it above `TodoList`.

**Tech Stack:** React 19, TypeScript, Zustand 5, Tailwind 4, Vitest + Testing Library + user-event, Storybook.

**Spec:** `docs/analysis/ticket-49-add-a-new-todo.md`

## Global Constraints

- `id` is `crypto.randomUUID()`, type `string`.
- Title is trimmed before saving; new todo has `done: false`.
- `Add` button is disabled while the trimmed title is empty. No `Title is required` text on the page, no `role="alert"`.
- Enter with an invalid title is silently ignored: no todo, no `alert`, input value kept.
- `createTodo` throws `Error("Title is required")` on empty/whitespace input (safety net only).
- `alert(...)` is used only inside `catch` for unexpected errors; the typed value is kept then.
- Duplicate titles allowed; no max length.
- New todos go to the **top** of the list (newest first).
- After a successful add the input is cleared and keeps focus.
- Project rules (`CLAUDE.md`): `@/` imports across folders, `import type`, `interface FooProps` read via `props.x`, named arrow-function exports, Tailwind classes, `index.ts` re-exports, a `*.stories.tsx` per component, tests import from `vitest` and use `afterEach(cleanup)`, role queries, `userEvent`.
- Per the user's global rule, do not run `git commit`/`push` in any step.

## Review Focus

- Whitespace-only title + Enter: nothing added, no `alert`, value kept (Task 4).
- Title with inner and outer spaces (`"  Buy  milk  "`): saved as `"Buy  milk"` (Task 1).
- Same title added twice: two items with different ids (Task 2, Task 5).
- `crypto.randomUUID` throws: `alert` called, no todo added, input value kept (Task 3, Task 4).
- Adding to a non-empty list: new todo first, existing order preserved (Task 2, Task 5).

---

### Task 1: `createTodo` plain function

**Files:**
- Create: `src/stores/todo/create-todo.ts`
- Create: `src/stores/todo/__test__/create-todo.test.ts`
- Modify: `src/stores/todo/index.ts` (add `export * from "./create-todo";`)

**Interfaces:**
- Produces: `createTodo(title: string): Todo` — returns `{ id: crypto.randomUUID(), title: title.trim(), done: false }`; throws `Error("Title is required")` when `title.trim()` is empty.

- [ ] **Step 1: Write the failing tests** in `create-todo.test.ts` (import `createTodo` from `@/stores/todo`):
  - `"trims the title and sets done to false"`: `createTodo("  Buy  milk  ")` has `title === "Buy  milk"`, `done === false`.
  - `"gives each todo a unique uuid id"`: two calls with the same title → `id`s differ, each matches `/^[0-9a-f-]{36}$/`.
  - `"throws Title is required for empty or whitespace-only input"`: `expect(() => createTodo("")).toThrow("Title is required")` and same for `"   "`.
- [ ] **Step 2: Run** `pnpm test src/stores/todo/__test__/create-todo.test.ts` — Expected: FAIL (`createTodo` not exported).
- [ ] **Step 3: Implement** `createTodo` in `create-todo.ts` and re-export it from `src/stores/todo/index.ts`.
- [ ] **Step 4: Run** the same command — Expected: PASS.
- [ ] **Step 5: Checkpoint** — no commit (global rule).

### Task 2: Store action `addTodo`

**Files:**
- Modify: `src/stores/todo/base.ts`
- Test: `src/stores/todo/__test__/base.test.ts`

**Interfaces:**
- Consumes: `createTodo(title: string): Todo` (Task 1).
- Produces: `TodoState.addTodo: (title: string) => void` — prepends `createTodo(title)` to `todos`; propagates the error if `createTodo` throws (state unchanged).

- [ ] **Step 1: Add failing tests** to `base.test.ts`:
  - `"addTodo puts the new todo first and keeps the rest in order"`: state `[TODO]`, `useTodoStore.getState().addTodo("New")` → titles `["New", "Buy milk"]`.
  - `"addTodo allows duplicate titles with different ids"`: add `"Same"` twice → length 2, ids differ.
  - `"addTodo throws and leaves todos unchanged for a blank title"`: `expect(() => addTodo("  ")).toThrow("Title is required")`, `todos` still `[]`.
- [ ] **Step 2: Run** `pnpm test src/stores/todo` — Expected: FAIL (`addTodo` is not a function).
- [ ] **Step 3: Implement** `addTodo` in `base.ts`: add it to `TodoState`, change the creator to `(set) => ({ todos: [], addTodo: (title) => set((state) => ({ todos: [createTodo(title), ...state.todos] })) })`. Import `createTodo` from `./create-todo` (same folder, relative).
- [ ] **Step 4: Run** `pnpm test src/stores/todo` — Expected: PASS (existing tests still pass).
- [ ] **Step 5: Checkpoint** — no commit.

### Task 3: `useTodoList` exposes `addTodo` handler

**Files:**
- Modify: `src/hooks/todo/use-todo-list.ts`
- Test: `src/hooks/todo/__test__/use-todo-list.test.ts`

**Interfaces:**
- Consumes: `useTodoStore` `addTodo` action (Task 2).
- Produces: `useTodoList()` returns `{ todos: Todo[]; addTodo: (title: string) => boolean }`. `addTodo` returns `true` on success; on a thrown error calls `alert(error.message)` (use `String(error)` fallback for non-`Error`) and returns `false`.

- [ ] **Step 1: Add failing tests**:
  - `"addTodo adds a trimmed todo at the top and returns true"`.
  - `"addTodo alerts and returns false when adding throws"`: `vi.spyOn(window, "alert").mockImplementation(() => {})` and `vi.spyOn(crypto, "randomUUID").mockImplementation(() => { throw new Error("boom"); })`; expect `alert` called with `"boom"`, result `false`, `todos` still `[]`. Restore mocks in `afterEach` (`vi.restoreAllMocks()`).
- [ ] **Step 2: Run** `pnpm test src/hooks/todo/__test__/use-todo-list.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** the handler in `use-todo-list.ts` with `try { addTodo(title); return true; } catch (error) { alert(...); return false; }`.
- [ ] **Step 4: Run** the same command — Expected: PASS.
- [ ] **Step 5: Checkpoint** — no commit.

### Task 4: `TodoForm` component

**Files:**
- Create: `src/components/todo/TodoForm/index.tsx`
- Create: `src/components/todo/TodoForm/index.test.tsx`
- Create: `src/components/todo/TodoForm/index.stories.tsx`
- Modify: `src/components/todo/index.ts` (add `export * from "./TodoForm";`)

**Interfaces:**
- Produces: `interface TodoFormProps { onAdd: (title: string) => boolean }`; `export const TodoForm = (props: TodoFormProps)`. Renders a `<form>` with a text input (`aria-label="New todo"`) and a submit button named `Add`. Button `disabled` while `title.trim()` is empty. Submit handler: `preventDefault`; return if trimmed title is empty; call `props.onAdd(title)`; only when it returns `true`, clear the input and refocus it (via ref). Return `false` keeps the value.

- [ ] **Step 1: Write failing tests** (`onAdd = vi.fn()`; `userEvent`; role queries):
  - `"disables Add while the input is empty or whitespace-only"`.
  - `"adds the typed title when Add is clicked, then clears the input and keeps focus on it"`: `onAdd` returns `true`; expect `onAdd` called with the typed text, input value `""`, input is `document.activeElement`.
  - `"adds the typed title when Enter is pressed"`.
  - `"does nothing when Enter is pressed with a whitespace-only title"`: `onAdd` not called, value kept.
  - `"keeps the typed value when onAdd returns false"`.
- [ ] **Step 2: Run** `pnpm test src/components/todo/TodoForm` — Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `TodoForm` (Tailwind classes consistent with `TodoItem`'s `BUTTON_CLASS`/input styling, `disabled:cursor-not-allowed disabled:opacity-40`), export it from `src/components/todo/index.ts`.
- [ ] **Step 4: Write stories** `index.stories.tsx` (same shape as `TodoList/index.stories.tsx`): `Default` with `args: { onAdd: () => true }`.
- [ ] **Step 5: Run** `pnpm test src/components/todo/TodoForm` — Expected: PASS.
- [ ] **Step 6: Preview (CLAUDE.md absolute rule)** — `preview_start` with the `storybook` config from `.claude/launch.json`, open the `todo/TodoForm` story, check console/logs for errors, type text + press Enter / click `Add`, take a screenshot as proof.
- [ ] **Step 7: Checkpoint** — no commit.

### Task 5: Wire `TodoForm` into `App`

**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `useTodoList().addTodo` (Task 3), `TodoForm` (Task 4).

- [ ] **Step 1: Add failing tests** to `App.test.tsx` (with `userEvent`):
  - `"adds a todo via the Add button and shows it in the list"`: type `"  Buy milk  "`, click `Add` → list item `Buy milk`, input empty, empty-state text gone.
  - `"adds a todo via Enter"`.
  - `"shows the newest todo first and allows duplicate titles"`: add `"A"`, `"B"`, `"A"` → list item texts `["A", "B", "A"]` (order newest first), 3 items.
  - `"does not add a whitespace-only title"`: type `"   "` → `Add` disabled; press Enter → still `No todos yet`.
- [ ] **Step 2: Run** `pnpm test src/App.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** in `App.tsx`: destructure `todos` and `addTodo` from `useTodoList()`, render `<TodoForm onAdd={addTodo} />` between the `<h1>` and `<TodoList />`.
- [ ] **Step 4: Run** `pnpm test`, `pnpm lint`, `pnpm build` — Expected: all pass.
- [ ] **Step 5: Preview (CLAUDE.md absolute rule)** — `preview_start` with the `dev` config, add several todos (incl. a whitespace-only attempt and a duplicate), check console/logs for errors, take a screenshot as proof.
- [ ] **Step 6: Checkpoint** — no commit.

---

**Self-review:** All acceptance criteria and resolved notes map to tasks (create/trim/reject → 1; top-of-list, duplicates → 2; `catch` + `alert` → 3; disabled button, Enter ignored, clear + focus → 4; integration → 5). Names are consistent: `createTodo`, `addTodo`, `TodoForm`, `onAdd`.
