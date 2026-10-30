# Plan: paginate the todo list (5 per page)

## Goal
The todo list shows 5 todos per page with a Prev / Next / page-number control (hidden for 5 or fewer todos). `currentPage` lives in the Zustand store, is not persisted, and is clamped so it never points past the last page.

## Assumptions
- Unconfirmed: page numbers are all shown, no ellipsis.
- Unconfirmed: adding a todo sets `currentPage` to 1 so the new todo is visible.
- Unconfirmed: `Pagination` lives in `components/shared/Pagination`.
- `src/components/shared/index.ts` currently only exports the sample Button; a real export is added for `Pagination`.
- Clamping after remove happens inside the `removeTodo` store action (and `setPage` clamps to valid range).

## Steps
1. Test: `paginateTodos(todos, page)` returns the slice and the clamped page/total pages (12 todos -> 5/5/2; page 0 or beyond last is clamped; empty list gives page 1).
   Files: `src/stores/todo/__test__/paginate-todos.test.ts` - Change: new tests.
2. Code: add `TODO_PAGE_SIZE = 5` and the pure helper.
   Files: `src/constants/todo.ts`, `src/constants/index.ts` (new), `src/stores/todo/paginate-todos.ts`, `src/stores/todo/index.ts` - Change: constant, helper, re-export.
3. Test: store `currentPage` and `setPage`; remove on last page clamps; add resets to page 1; `partialize` still persists only `todos`.
   Files: `src/stores/todo/__test__/base.test.ts`, `src/stores/todo/__test__/persist.test.ts` - Change: new cases.
4. Code: add `currentPage` (default 1) and `setPage` to `TodoState`; clamp in `removeTodo`; reset in `addTodo`.
   Files: `src/stores/todo/base.ts` - Change: state and actions; `partialize` unchanged.
5. Test: `Pagination` renders nothing for 5 or fewer todos, marks current page with `aria-current="page"`, disables Prev on first and Next on last page, calls `onPageChange` for number, Prev and Next.
   Files: `src/components/shared/Pagination/index.test.tsx` - Change: new tests (role queries, `userEvent`, `afterEach(cleanup)`).
6. Code: `Pagination` component plus story (few pages, many pages, first/last page).
   Files: `src/components/shared/Pagination/index.tsx`, `index.stories.tsx`, `src/components/shared/index.ts` - Change: new component, Tailwind classes, export.
7. Test: `useTodoList` returns only the current page slice plus page info; `App` shows 5 of 12 todos and navigates.
   Files: `src/hooks/todo/__test__/use-todo-list.test.ts`, `src/App.test.tsx` - Change: new cases.
8. Code: expose `pagedTodos`, `currentPage`, `totalPages`, `setPage` from the hook; render `Pagination` under `TodoList` in `App`.
   Files: `src/hooks/todo/use-todo-list.ts`, `src/App.tsx` - Change: wiring.

## Done check
- `pnpm test`, `pnpm lint`, `pnpm build` all exit 0
- Each acceptance criterion (12 todos 5/5/2, edge disabling, hidden at 5 or fewer, clamp after remove, add on top of page 1, reload resets to page 1) is covered by a passing test
- UI touched: `preview_start` the `storybook` config, check the `Pagination` stories, no console errors, screenshot taken
