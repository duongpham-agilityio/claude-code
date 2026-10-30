# Plan: paginate the todo list (5 per page)

## Goal
The todo list shows 5 todos per page with a Prev / Next / page-number control (hidden for 5 or fewer todos). `currentPage` lives in the Zustand todo store, is not persisted, and always stays on a valid page.

## Assumptions
- Unconfirmed: adding a todo resets `currentPage` to 1 so the new todo is visible.
- Unconfirmed: `Pagination` lives in `components/shared` (generic props: `currentPage`, `totalPages`, `onPageChange`).
- Total pages is at least 1 (an empty list has 1 page), so clamping never yields page 0.
- `src/constants` has only a `*.sample.ts` file and no `index.ts`; add `todo.ts` and an `index.ts` re-export.
- Keep API small so the parallel drag-drop work (#96) can rebase: `TODO_PAGE_SIZE`, `currentPage`, `setPage`, `paginateTodos`.

## Steps
1. Test: `paginateTodos(todos, page, pageSize)` returns `{ items, page, totalPages }`; 12 todos give 5/5/2; out-of-range page clamps to valid range; empty list gives page 1, 1 page.
   Files: `src/stores/todo/__test__/paginate-todos.test.ts` - Change: new test.
2. Code: pure helper plus constant.
   Files: `src/constants/todo.ts` (`TODO_PAGE_SIZE = 5`), `src/constants/index.ts`, `src/stores/todo/paginate-todos.ts`, `src/stores/todo/index.ts` - Change: add and re-export.
3. Test: store `currentPage` defaults to 1; `setPage` sets it; removing the last todo on the last page moves `currentPage` to the last valid page; adding resets to 1; `partialize` still persists only `todos` (reload starts at page 1).
   Files: `src/stores/todo/__test__/base.test.ts`, `src/stores/todo/__test__/persist.test.ts` - Change: add cases.
4. Code: store state.
   Files: `src/stores/todo/base.ts` - Change: add `currentPage` and `setPage` to `TodoState`; clamp in `removeTodo`; reset in `addTodo`; leave `partialize` and `merge` as is.
5. Test: `useTodoList` returns `pagedTodos`, `currentPage`, `totalPages`, `setPage`.
   Files: `src/hooks/todo/__test__/use-todo-list.test.ts` - Change: add cases.
6. Code: hook exposes paginated data.
   Files: `src/hooks/todo/use-todo-list.ts` - Change: select `currentPage`/`setPage`, compute page slice with `paginateTodos`.
7. Test: `Pagination` renders nothing with 1 page; Prev disabled on first page, Next disabled on last; current page has `aria-current="page"`; clicks call `onPageChange`.
   Files: `src/components/shared/Pagination/index.test.tsx` - Change: new test (role queries, `userEvent`, `afterEach(cleanup)`).
8. Code: `Pagination` component and stories (few pages, many pages, first page, last page).
   Files: `src/components/shared/Pagination/index.tsx`, `src/components/shared/Pagination/index.stories.tsx`, `src/components/shared/index.ts` - Change: new component with `interface PaginationProps`, Tailwind classes.
9. Test and code: `App` shows 5 todos with 12 in store and the pagination control; page change shows the next slice.
   Files: `src/App.test.tsx`, `src/App.tsx` - Change: render `pagedTodos` and `Pagination` from `useTodoList`.

## Done check
- `pnpm test`, `pnpm lint`, `pnpm build` all exit 0
- Every "Done when" behaviour (5/5/2 split, disabled Prev/Next, `aria-current`, hidden control, clamp after remove, add on page 1, reload resets) is covered by a passing test
- UI touched: `preview_start` the `storybook` config, check the Pagination stories, no console errors, screenshot taken
