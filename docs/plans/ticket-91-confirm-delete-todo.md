# Ticket 91: Confirm before deleting a todo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking Delete on a todo asks the user via `window.confirm`; the todo is removed only if the user confirms.

**Architecture:** The only place the Delete click is handled is `TodoItem` (`onClick={() => props.onRemove?.(props.todo.id)}`). Wrap that in a `handleRemove` that calls `window.confirm(message)` first and calls `props.onRemove` only on `true`. `TodoList`, `App` and the hook are untouched; their existing delete tests and stories must stub `window.confirm` because jsdom/Playwright would otherwise return `false` or block.

**Tech Stack:** React 19, TypeScript, Vitest + Testing Library (jsdom), Storybook (`storybook/test`).

**Spec:** `docs/bug-reports/ticket-91-delete-todo-no-confirmation.md` (GitHub issue 91). Reporter answers in `docs/analysis/ticket-91-delete-todo-confirmation-dialog.md`: use `window.confirm`; Cancel/Escape dismiss (native behavior); confirm also applies in edit mode.

## Global Constraints

- Dialog is the native `window.confirm` — no custom modal, no new shared component.
- Message text, verbatim (reporter's wording was ungrammatical; this is the agreed cleaner replacement, pending reporter confirmation): `Delete "<todo title>"? This action cannot be undone.`
- Project conventions: named arrow-function exports, props read via `props.x`, `import type`, `@/` alias across folders, tests import from `vitest`, component tests use `afterEach(cleanup)`, `userEvent` and role queries.
- No git commit/push steps in this plan (global rule); do not touch `*.sample.*` files.
- Every changed component keeps its `*.stories.tsx` current.

## Review Focus

- Cancel (`confirm` → `false`) leaves the todo and does not call `onRemove`. Pinned in Task 1.
- Confirm is called exactly once per Delete click, with the todo's current title (not the edit draft). Pinned in Task 1.
- Delete while editing: confirm → `onRemove` called; cancel → row stays in edit mode with the draft intact. Pinned in Task 1.
- Title containing quotes or very long text is passed through unescaped. Pinned in Task 1.
- Delete with no `onRemove` prop does not throw (confirm stubbed `true`). Pinned in Task 1 via the existing `renders without callbacks` test.
- Duplicate titles: only the clicked row is removed after confirm. Existing App test, kept green in Task 2.

---

### Task 1: Confirm step in `TodoItem`

**Files:**
- Modify: `src/components/todo/TodoItem/index.tsx` (Delete button `onClick`, line ~110; add `handleRemove`)
- Modify: `src/components/todo/TodoItem/index.test.tsx`
- Modify: `src/components/todo/TodoItem/index.stories.tsx` (`Delete` story)

**Interfaces:**
- Consumes: `TodoItemProps.onRemove?: (id: Todo["id"]) => void` (unchanged).
- Produces: unchanged props. Behavior: `onRemove(id)` fires only after `window.confirm(`Delete "${todo.title}"? This action cannot be undone.`)` returns `true`.

- [ ] **Step 1: Write the failing tests** in `index.test.tsx`
  - Change `afterEach(cleanup)` to also `vi.restoreAllMocks()`.
  - Add a helper `mockConfirm = (answer: boolean) => vi.spyOn(window, "confirm").mockReturnValue(answer)`.
  - Update `calls onRemove with the id when Delete is clicked` to call `mockConfirm(true)` first (assertion unchanged).
  - New tests (names as given):
    - `asks for confirmation with the todo title before deleting` — `confirm` toHaveBeenCalledTimes(1) and toHaveBeenCalledWith(`Delete "Learn React"? This action cannot be undone.`).
    - `does not call onRemove when the user cancels the confirmation` — `mockConfirm(false)`; `onRemove` not called; `Learn React` text still present.
    - `confirms and removes while editing, using the saved title not the draft` — click Edit, type `x` into the textbox, click Delete with `mockConfirm(true)`; message uses `Learn React`; `onRemove` called with `TODO.id`.
    - `keeps edit mode and the draft when deletion is cancelled while editing` — `mockConfirm(false)`; textbox still present with value `Learn Reactx`.
    - `passes quotes in the title through to the confirmation message` — todo title `Say "hi"`; message is `Delete "Say "hi""? This action cannot be undone.`.
  - `renders without callbacks and does not throw on click`: add `mockConfirm(true)` so jsdom's unimplemented `confirm` is not hit.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/components/todo/TodoItem`
Expected: FAIL — `confirm` never called / `onRemove` called without confirmation.

- [ ] **Step 3: Implement `handleRemove` in `src/components/todo/TodoItem/index.tsx`**

`const handleRemove = (): void` inside `TodoItem`: `if (window.confirm(...)) props.onRemove?.(props.todo.id);` using the exact message from Global Constraints. Delete button `onClick={handleRemove}`. Keep the `onRemove` optional-chaining.

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test src/components/todo/TodoItem`
Expected: PASS (all `TodoItem` tests).

- [ ] **Step 5: Update the `Delete` story** in `index.stories.tsx`
  - In `play`, before the click: `const confirmSpy = spyOn(window, "confirm").mockReturnValue(true)` (`spyOn` from `storybook/test`); after assertions assert `confirmSpy` toHaveBeenCalledWith the agreed message and call `confirmSpy.mockRestore()`.
  - Add story `DeleteCancelled`: same setup with `mockReturnValue(false)`; assert `args.onRemove` not toHaveBeenCalled; restore the spy.

---

### Task 2: Keep dependent tests and stories green

**Files:**
- Modify: `src/components/todo/TodoList/index.test.tsx` (test at line ~119)
- Modify: `src/components/todo/TodoList/index.stories.tsx` (`WithRemove`, line ~62)
- Modify: `src/App.test.tsx` (tests `deletes only the clicked todo`, `shows No todos yet after the last todo is deleted`)
- Add: one end-to-end test in `src/App.test.tsx`

**Interfaces:**
- Consumes: Task 1 behavior (`TodoItem` asks `window.confirm` before `onRemove`).
- Produces: nothing new.

- [ ] **Step 1: Run the suite to see the expected breakage**

Run: `pnpm test`
Expected: FAIL in the three delete tests above (`confirm` not implemented in jsdom → falsy → no removal).

- [ ] **Step 2: Stub confirm in the existing tests**
  - Each of the three tests: `vi.spyOn(window, "confirm").mockReturnValue(true)` at the start (`App.test.tsx` already runs `vi.restoreAllMocks()` in `afterEach`; in `TodoList/index.test.tsx` add the same restore to its `afterEach` if missing). Assertions unchanged.
  - `WithRemove` story: same `spyOn(window, "confirm").mockReturnValue(true)` before the click and `mockRestore()` at the end of `play`.

- [ ] **Step 3: Add the App-level cancel test** in `src/App.test.tsx`
  - `keeps the todo when the delete confirmation is cancelled` — seed one todo `Buy milk`, `mockReturnValue(false)`, click `Delete Buy milk`; assert the todo is still listed and `useTodoStore.getState().todos` has length 1.

- [ ] **Step 4: Verify everything**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: all PASS, no new lint warnings.

Run: `vitest run --project storybook`
Expected: PASS, including `DeleteCancelled`.

- [ ] **Step 5: Preview check (project rule)**

`preview_start` config `storybook`, open `todo/TodoItem → Delete` and `DeleteCancelled`, check console for errors, screenshot. Then `preview_start` config `dev`: add `Walk dog`, click Delete, confirm the native dialog text matches, Cancel keeps the todo, OK removes it.
