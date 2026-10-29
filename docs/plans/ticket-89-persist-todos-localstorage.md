# Persist Todos in localStorage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Todos (title, done state, edits, removals) survive a page reload.

**Architecture:** Wrap the existing zustand store in the built-in `persist` middleware with `localStorage`, saving only `todos`. A `merge` guard rejects stored data of the wrong shape so a corrupt entry cannot crash the app.

**Tech Stack:** zustand ^5.0.16 (`zustand/middleware`), React 19, Vitest (jsdom), Testing Library.

**Spec:** `docs/bug-reports/ticket-89-todos-not-persisted-after-reload.md` (GitHub issue #89). Reporter answers: use `localStorage`; persist the whole list including done state and edited titles.

## Global Constraints

- Storage: `localStorage` only; no backend/API.
- Persist the whole `todos` list (id, title, done); action functions are never stored.
- No new dependency; `persist` ships with the installed `zustand`.
- Project conventions: `@/` alias across folders, `import type`, UPPER_SNAKE_CASE constants, Conventional Commits, Vitest imports from `vitest` (no globals).
- Do not commit or push as part of this plan (the user runs the `commit` / `push-pr` skills).

## Review Focus

1. Corrupt JSON in the storage key (`"{not json"`): app starts with an empty list, no crash.
2. Wrong shape in storage (`{"state":{"todos":"oops"},"version":0}`): app starts with an empty list, no crash.
3. Entries inside `todos` that are not valid todos (missing `id`/`title`, `done` not boolean): invalid entries are dropped, valid ones kept.
4. Existing tests reset the store with `setState(getInitialState())`: reset must not leak persisted todos into the next test.
5. `localStorage` unavailable or throwing: store still works in memory (Task 1 test pins it; may need a try/catch wrapper around `setItem`).

---

### Task 1: Persist the todo store

**Files:**
- Modify: `src/stores/todo/base.ts:1-30`
- Test: `src/stores/todo/__test__/persist.test.ts` (create)

**Interfaces:**
- Consumes: `useTodoStore`, `TodoState`, `Todo` (existing in `base.ts` / `@/types/todo`).
- Produces: `TODO_STORAGE_KEY = "todo-store"` exported from `base.ts`; `useTodoStore` now has `useTodoStore.persist.rehydrate(): Promise<void> | void` and `useTodoStore.persist.clearStorage()` (zustand API). Stored value shape: `{ "state": { "todos": Todo[] }, "version": 0 }`.

- [ ] **Step 1: Write the failing tests in `persist.test.ts`**

Each test starts with `localStorage.clear()` and `useTodoStore.setState(useTodoStore.getInitialState())` in `beforeEach`; `afterEach` does the same plus `vi.restoreAllMocks()`. Tests (names exact):
  - `"writes todos to localStorage under TODO_STORAGE_KEY after addTodo"`: `addTodo("Buy milk")`; parse `localStorage.getItem(TODO_STORAGE_KEY)`; expect `state.todos[0].title === "Buy milk"` and `state` has only the key `todos` (no functions).
  - `"restores todos from localStorage on rehydrate"`: set item to `{"state":{"todos":[{"id":"a","title":"Buy milk","done":true}]},"version":0}`; `await useTodoStore.persist.rehydrate()`; expect `getState().todos` toEqual that array.
  - `"keeps done state and edited title across rehydrate"`: add todo, `toggleTodo(id, true)`, `updateTodo(id, "Renamed")`; `await useTodoStore.persist.rehydrate()` and expect `{ title: "Renamed", done: true }`.
  - `"starts empty when stored JSON is corrupt"`: item `"{not json"`; rehydrate; expect `todos` `[]`.
  - `"starts empty when stored todos is not an array"`: item `{"state":{"todos":"oops"},"version":0}`; rehydrate; expect `[]`.
  - `"drops stored entries that are not valid todos"`: stored todos `[{"id":"a","title":"Ok","done":false},{"id":"b"},{"id":"c","title":"X","done":"yes"},null]`; rehydrate; expect only the first entry.
  - `"still works in memory when localStorage.setItem throws"`: `vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); })`; `addTodo("Buy milk")` does not throw and `getState().todos` has length 1.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/stores/todo/__test__/persist.test.ts`
Expected: FAIL (`TODO_STORAGE_KEY` not exported / `useTodoStore.persist` undefined).

- [ ] **Step 3: Implement persistence in `src/stores/todo/base.ts`**

  - Export `const TODO_STORAGE_KEY = "todo-store";`.
  - Add private `isTodo(value: unknown): value is Todo` (object with string `id`, string `title`, boolean `done`).
  - Wrap the creator: `create<TodoState>()(persist((set) => ({...unchanged...}), { name: TODO_STORAGE_KEY, storage: createJSONStorage(() => localStorage), partialize: (state) => ({ todos: state.todos }), merge: ... }))`.
  - `merge(persisted, current)`: read `persisted?.todos`; if not an array return `current`; otherwise return `{ ...current, todos: persisted.todos.filter(isTodo) }`.
  - If the `setItem throws` test fails (zustand's JSON storage does not catch write errors), pass a custom `storage` whose `setItem` wraps `createJSONStorage(() => localStorage)`'s `setItem` in try/catch and ignores the error.
  - Imports from `zustand/middleware` (`persist`, `createJSONStorage`) go in the external-libs block.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/stores/todo/__test__/persist.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Keep the existing suite green**

Run: `pnpm test`
Expected: all pass. If a test fails from leaked persisted state, add `localStorage.clear()` to that file's `afterEach` (files: `base.test.ts`, `use-todo-list.test.ts`, `App.test.tsx`); do not change assertions.

---

### Task 2: Verify in the running app

**Files:**
- No code changes.

**Interfaces:**
- Consumes: persisted `useTodoStore` from Task 1.

- [ ] **Step 1: Static checks**

Run: `pnpm lint && pnpm build`
Expected: no lint errors, build succeeds.

- [ ] **Step 2: Preview (required by CLAUDE.md preview rule)**

`preview_start` with `dev`. In the app: add `Buy milk` and `Walk dog`, toggle `Buy milk` done, edit `Walk dog` to `Walk dog now`, reload the page.
Expected: both todos still listed, `Buy milk` still done, title reads `Walk dog now`. Then delete one and reload: it stays deleted. Console has no errors. Take a screenshot as proof, then `preview_stop`.

- [ ] **Step 3: Corrupt-data check in the browser**

With the app open run in the console `localStorage.setItem("todo-store", "{not json")` and reload.
Expected: "No todos yet", no crash, no console error beyond zustand's storage warning if any.

- [ ] **Step 4: Checkpoint**

Do not commit. Report results; the user commits via the `commit` skill (suggested message: `fix(todo): persist todos in localStorage`).
