# Plan: reorder todos by drag and drop

## Goal
Users can drag a `TodoItem` by a handle (or use the keyboard) to a new position on the current page. The new order is written into the full `todos` array and persists through the existing `persist` middleware.

## Assumptions
- Unconfirmed: `fromIndex` / `toIndex` are page-relative; `pageStart` is the full-array index of the first item on the page.
- Unconfirmed: drag handle `aria-label` is `Drag to reorder <title>`.
- Unconfirmed: the PR targets the #95 branch (`feat/paginate-todo-list`) because this work builds on pagination.
- New dependencies `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` are required by the ticket itself.
- Out-of-range or equal indexes return the same array unchanged.

## Steps
1. Test: `reorderTodos` moves within a page, first/last, same index (unchanged), non-first page offset (items on other pages keep position), out-of-range no-op.
   Files: `src/stores/todo/__test__/reorder-todo.test.ts` - Change: new tests.
2. Code: pure helper.
   Files: `src/stores/todo/reorder-todo.ts`, `src/stores/todo/index.ts` - Change: add helper and re-export.
3. Test: store action `reorderTodo(fromIndex, toIndex)` uses the current page, updates `todos`, and the order is persisted.
   Files: `src/stores/todo/__test__/base.test.ts`, `src/stores/todo/__test__/persist.test.ts` - Change: new cases.
4. Code: `reorderTodo` in `TodoState` using `currentPage` and `TODO_PAGE_SIZE` for `pageStart`; `partialize` unchanged.
   Files: `src/stores/todo/base.ts` - Change: new action.
5. Test: `TodoItem` shows a drag handle with an accessible label, buttons and inputs still work; `TodoList` reorders with the keyboard (focus handle, Space, ArrowDown, Space) and calls `onReorder`.
   Files: `src/components/todo/TodoItem/index.test.tsx`, `src/components/todo/TodoList/index.test.tsx` - Change: new tests (`userEvent`, role queries).
6. Code: add dependencies; `TodoList` wraps items in `DndContext` (`PointerSensor`, `KeyboardSensor` with sortable coordinates) and `SortableContext`; `TodoItem` uses `useSortable` with a handle button; new optional `onReorder` prop.
   Files: `package.json`, `pnpm-lock.yaml`, `src/components/todo/TodoList/index.tsx`, `src/components/todo/TodoItem/index.tsx` - Change: DnD wiring, Tailwind classes.
7. Test and code: hook and App expose and pass `reorderTodo`; App test reorders by keyboard.
   Files: `src/hooks/todo/use-todo-list.ts`, `src/hooks/todo/__test__/use-todo-list.test.ts`, `src/App.tsx`, `src/App.test.tsx` - Change: wiring and tests.
8. Stories: update `TodoItem` and `TodoList` stories (with handle, reordered state).
   Files: `src/components/todo/TodoItem/index.stories.tsx`, `src/components/todo/TodoList/index.stories.tsx` - Change: new stories.

## Done check
- `pnpm test`, `pnpm lint`, `pnpm build` all exit 0
- Each acceptance criterion is covered by a passing test (pointer drag covered in story and preview)
- UI touched: `preview_start` the `storybook` config, check the `TodoList` stories, no console errors, screenshot taken
