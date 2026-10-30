# Plan: paginate the todo list (5 per page)

## Goal
The todo list shows 5 todos per page with a Prev / Next / page-number control (hidden when there are 5 or fewer). `currentPage` lives in the Zustand store, is not persisted, and always stays on a valid page.

## Assumptions
- Unconfirmed (Q1): adding a todo resets `currentPage` to 1.
- Unconfirmed (Q2): all page numbers render, no ellipsis window. The "many pages" story just uses e.g. 8 pages.
- Removing / edge cases: `removeTodo` clamps `currentPage` to the last valid page (min 1); with zero todos the page is 1.
- Toggle and update do not change the page.
- `Pagination` goes in `src/components/todo/Pagination` (todo feature folder; `components/shared` has only sample code).
- Reorder/drag-drop (#96) is out of scope; `TodoList` is not changed, so overlap stays low. The slicing happens in the hook, `App` passes the sliced array.

## Steps
1. Test: `paginateTodos` slices (12 todos: 5/5/2), returns total pages, clamps out-of-range pages (too high, below 1, zero todos).
   Files: `src/stores/todo/__test__/paginate-todos.test.ts` - Change: new tests.
2. Code: pure helpers `paginateTodos(todos, page, size)` and `clampPage(page, total, size)`; add `TODO_PAGE_SIZE = 5`.
   Files: `src/stores/todo/paginate-todos.ts`, `src/stores/todo/index.ts` (re-export), `src/constants/todo.ts`, `src/constants/index.ts` (new, re-export) - Change: new files.
3. Test: store has `currentPage` (default 1), `setPage` clamps, `addTodo` resets to 1, `removeTodo` of the last todo on the last page moves back, `partialize` still persists only `todos` (reload starts at page 1).
   Files: `src/stores/todo/__test__/base.test.ts`, `src/stores/todo/__test__/persist.test.ts` - Change: add cases.
4. Code: add `currentPage` and `setPage` to `TodoState`; wire `addTodo` / `removeTodo` as above; `partialize` unchanged.
   Files: `src/stores/todo/base.ts` - Change: state and actions.
5. Test: `useTodoList` returns the current page's todos, `currentPage`, `totalPages`, `setPage`.
   Files: `src/hooks/todo/__test__/use-todo-list.test.ts` - Change: add cases.
6. Code: expose `pagedTodos`, `currentPage`, `totalPages`, `setPage` from the hook (keep `todos`).
   Files: `src/hooks/todo/use-todo-list.ts` - Change: select the new store fields, derive values.
7. Test: `Pagination` component (role queries, `userEvent`): renders nothing when `totalPages <= 1`, Prev disabled on first page, Next disabled on last, `aria-current="page"` on current, clicks call `onPageChange` with the right page.
   Files: `src/components/todo/Pagination/index.test.tsx` - Change: new tests.
8. Code: `Pagination` component (`interface PaginationProps`: `currentPage`, `totalPages`, `onPageChange`), Tailwind styles, nav landmark with a label; export from the todo index; add stories (FewPages, ManyPages, FirstPage, LastPage).
   Files: `src/components/todo/Pagination/index.tsx`, `src/components/todo/Pagination/index.stories.tsx`, `src/components/todo/index.ts` - Change: new component.
9. Test: `App` shows 5 todos on page 1 with 12 todos and changes after clicking page 2 / Next.
   Files: `src/App.test.tsx` - Change: add cases.
10. Code: render `TodoList` with the paged todos and `Pagination` under it.
    Files: `src/App.tsx` - Change: use the new hook fields.

## Done check
- `pnpm test`, `pnpm lint`, `pnpm build` all exit 0
- Every acceptance criterion of #95 is covered by a passing test
- UI touched: `preview_start` the `storybook` config, check the Pagination stories, no console errors, screenshot taken
