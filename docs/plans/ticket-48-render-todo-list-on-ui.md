# Render Todo List on UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show an initially empty todo list under the heading "Todo Practice", with an empty-state message and a visible done / not-done state per todo.

**Architecture:** `Todo` type + Zustand store (`useTodoStore`) own the state. Custom hook `useTodoList` wraps the store and exposes `todos`. `App` calls the hook and passes `todos` to a presentational `TodoList` component (so tests inject todos by prop). Semantic HTML + Tailwind utility classes.

**Tech Stack:** React 19, TypeScript (strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`), Zustand 5, Tailwind 4, Vitest + Testing Library (jsdom), Storybook.

**Spec:** `docs/analysis/ticket-48-render-todo-list-on-ui.md` (all 6 questions answered).

## Global Constraints

- `Todo` = `{ id: string; title: string; done: boolean }`; `id` is a UUID string.
- State in a Zustand store, initial `todos: []`; a custom hook calls the store and exposes the state.
- `TodoList` takes a `todos` prop; `App` owns the hook call.
- Heading text is exactly `Todo Practice`, an `h1`.
- Empty state text is exactly `No todos yet`.
- Semantic tags mandatory (`main`, `h1`, `ul`, `li`); Tailwind utility classes for styling.
- Done todo: title has strikethrough (`line-through`); not-done: no strikethrough. Display only — no toggle, add or delete.
- Repo conventions (`CLAUDE.md`): `@/` alias across folders; named arrow-function components (no `export default` except `App`); `interface FooProps`, read `props.x` (no destructuring); tests import `describe/it/expect` from `vitest`; component tests use `afterEach(cleanup)` and role queries; every component has a `*.stories.tsx`; each folder re-exports via `index.ts`.
- Existing `*.sample.*` files stay untouched. Only the `HomePage.sample` import is dropped from `App`. Sample cleanup is out of scope (not decided by the ticket).
- No git commit / push steps in this plan; commit afterwards with the `commit` skill.

## Review Focus

- Two todos with the same title: both render, no key warning (key is `id`, not `title`).
- List goes empty → non-empty → empty on re-render: empty-state message appears, disappears, returns.
- Done state not conveyed by colour alone: done title carries `line-through` regardless of any colour class.
- Very long title with no spaces: wraps instead of overflowing (`break-words` on the title).
- Store state leaking between tests: tests read `useTodoStore.getInitialState()` or reset the store in `afterEach`.

---

### Task 1: `Todo` type and Zustand store

**Files:**
- Create: `src/types/todo/base.ts`, `src/stores/todo/base.ts`, `src/stores/todo/index.ts`
- Modify: `src/types/todo/index.ts` (add `export * from "./base";`)
- Test: `src/stores/todo/__test__/base.test.ts`

**Interfaces:**
- Produces: `interface Todo { id: string; title: string; done: boolean }` from `@/types/todo`; `useTodoStore` from `@/stores/todo` — a zustand hook whose state is `interface TodoState { todos: Todo[] }`, initial `{ todos: [] }`.

- [ ] **Step 1: Write the failing test** in `src/stores/todo/__test__/base.test.ts`: `it("starts with an empty todo list")` → `expect(useTodoStore.getInitialState().todos).toEqual([])`; `it("keeps todos set through setState")` → `useTodoStore.setState({ todos: [todo] })` then `expect(useTodoStore.getState().todos).toEqual([todo])`, with `afterEach(() => useTodoStore.setState(useTodoStore.getInitialState()))`. Import from `@/stores/todo` and `import type { Todo } from "@/types/todo"`.
- [ ] **Step 2: Run** `pnpm test src/stores` — Expected: FAIL (module `@/stores/todo` not found).
- [ ] **Step 3: Implement** `Todo` in `src/types/todo/base.ts`; `TodoState` + `useTodoStore = create<TodoState>()(() => ({ todos: [] }))` in `src/stores/todo/base.ts`; `export * from "./base";` in `src/stores/todo/index.ts`; add the `./base` export to `src/types/todo/index.ts` next to the sample exports.
- [ ] **Step 4: Run** `pnpm test src/stores` — Expected: PASS (existing `base.sample.test.ts` todos stay skipped).

### Task 2: `useTodoList` hook

**Files:**
- Create: `src/hooks/todo/use-todo-list.ts`
- Modify: `src/hooks/todo/index.ts` (add `export * from "./use-todo-list";`)
- Test: `src/hooks/todo/__test__/use-todo-list.test.ts`

**Interfaces:**
- Consumes: `useTodoStore` from `@/stores/todo`, `Todo` from `@/types/todo`.
- Produces: `useTodoList(): { todos: Todo[] }` from `@/hooks/todo`.

- [ ] **Step 1: Write the failing tests** with `renderHook`: `it("starts with an empty todo list")` → `result.current.todos` equals `[]`; `it("reflects todos set in the store")` → inside `act`, `useTodoStore.setState({ todos: [todo] })`, then `result.current.todos` equals `[todo]`. Reset store in `afterEach` as in Task 1.
- [ ] **Step 2: Run** `pnpm test src/hooks` — Expected: FAIL (`useTodoList` not exported).
- [ ] **Step 3: Implement** `useTodoList` in `src/hooks/todo/use-todo-list.ts`: select `todos` with `useTodoStore((state) => state.todos)` and return `{ todos }`. No handlers (out of scope).
- [ ] **Step 4: Run** `pnpm test src/hooks` — Expected: PASS.

### Task 3: `TodoList` component and story

**Files:**
- Create: `src/components/todo/TodoList/index.tsx`, `src/components/todo/TodoList/index.test.tsx`, `src/components/todo/TodoList/index.stories.tsx`
- Modify: `src/components/todo/index.ts` (add `export * from "./TodoList";`)

**Interfaces:**
- Consumes: `Todo` from `@/types/todo`.
- Produces: `interface TodoListProps { todos: Todo[] }`; `TodoList = (props: TodoListProps) => JSX.Element` from `@/components/todo`.

- [ ] **Step 1: Write the failing tests** in `index.test.tsx` (`@testing-library/jest-dom/vitest`, `afterEach(cleanup)`, role queries). Use literal UUID strings for ids.
  - `it("shows the empty message and no list when there are no todos")` → `getByText("No todos yet")` present, `queryByRole("list")` is `null`.
  - `it("renders one list item per todo with its title")` → 3 todos → `getByRole("list")`, `getAllByRole("listitem")` length 3, each title visible.
  - `it("strikes through the title of a done todo only")` → `getByText("Done task")` `toHaveClass("line-through")`; `getByText("Open task")` `not.toHaveClass("line-through")`.
  - `it("renders todos that share a title")` → two todos titled `"Same"` with different ids → `getAllByRole("listitem")` length 2.
  - `it("switches between empty state and list as todos change")` → `rerender` with `[]` → with one todo → with `[]`; assert message absent in the middle, present at both ends.
  - `it("lets a long unbroken title wrap")` → title `"a".repeat(200)` → `toHaveClass("break-words")`.
- [ ] **Step 2: Run** `pnpm test src/components/todo/TodoList` — Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `TodoList` in `index.tsx`. Empty → `<p>No todos yet</p>`. Otherwise `<ul>` with `<li key={todo.id}>` containing a `<span>` title whose classes are `break-words` always, plus `line-through text-gray-400` when `todo.done`. Tailwind spacing on `ul` / `li` is free choice.
- [ ] **Step 4: Add story** `index.stories.tsx` (CSF3, `Meta<typeof TodoList>` / `StoryObj` from `@storybook/react-vite`): stories `Empty` (`todos: []`) and `Mixed` (done + not-done todos). Storybook picks it up because it is not `*.sample.stories.*`.
- [ ] **Step 5: Run** `pnpm test src/components/todo/TodoList` — Expected: PASS. Then `pnpm lint` — Expected: no errors.

### Task 4: Wire `App`

**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `useTodoList` from `@/hooks/todo`, `TodoList` from `@/components/todo`, `useTodoStore` from `@/stores/todo` (tests only).

- [ ] **Step 1: Write the failing tests** in `src/App.test.tsx` (store reset in `afterEach`, plus `cleanup`): `it("shows the app heading and the empty state")` → `getByRole("heading", { level: 1, name: "Todo Practice" })` and `getByText("No todos yet")`; `it("renders todos from the store")` → `act(() => useTodoStore.setState({ todos: [done, open] }))` then both titles visible in a `list` with two `listitem`s.
- [ ] **Step 2: Run** `pnpm test src/App.test.tsx` — Expected: FAIL (App still renders `HomePage`).
- [ ] **Step 3: Implement** `App` (keep `export default App`): call `useTodoList()`, return `<main>` with `<h1>Todo Practice</h1>` and `<TodoList todos={todos} />`; remove the `HomePage.sample` import. Add Tailwind classes on `main` / `h1` for basic layout.
- [ ] **Step 4: Run** `pnpm test`, `pnpm lint`, `pnpm build` — Expected: all pass; then `pnpm dev` and confirm heading + `No todos yet` render at `localhost:5173`.

## Self-Review

- Spec coverage: Q1 store + hook (Tasks 1–2); Q2 `todos` prop (Task 3, 4); Q3 Tailwind + semantic tags (Tasks 3–4); Q4 done / not-done styling, no toggle (Task 3); Q5 heading (Task 4); Q6 `id: string` UUID (Task 1).
- Types consistent: `Todo`, `TodoState`, `useTodoStore`, `useTodoList`, `TodoListProps`, `TodoList` named identically across tasks.
