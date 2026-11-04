# Plan: Reorder todos by drag and drop

## Goal
Users can drag a todo by a handle, or use the keyboard, to a new position; the order is stored in `todos` and persisted. New todos still go on top.

## Assumptions
- Unconfirmed: #95 is not in `develop`, so the visible page is the whole list and `pageStart` is 0. `TodoList` accepts an optional `pageStart` prop (default 0) and an optional `onReorder(pageStart, fromIndex, toIndex)` callback; indexes are relative to the page slice.
- Unconfirmed: add `@dnd-kit/core`, `@dnd-kit/sortable` and `@dnd-kit/utilities` (the ticket asks for them).
- `TodoItem` must still render outside a `DndContext` (existing tests and stories), so `useSortable` is used without requiring a provider.
- Expected merge conflicts with #95 in `TodoList`, `App.tsx` and `use-todo-list.ts`.

## Steps
1. Test: `reorderTodos` helper: within page, first/last, same index (returns equal list), non-first page offset, out-of-range indexes unchanged, does not mutate.
   Files: `src/stores/todo/__test__/reorder-todo.test.ts` - Change: new tests.
2. Code: helper `reorderTodos(todos, pageStart, fromIndex, toIndex)` using array move on `pageStart + index`; export from `src/stores/todo/index.ts`.
   Files: `src/stores/todo/reorder-todo.ts`, `src/stores/todo/index.ts`.
3. Test: store action `reorderTodo(pageStart, fromIndex, toIndex)` reorders, new todos stay on top after reorder, persisted order is written to localStorage.
   Files: `src/stores/todo/__test__/base.test.ts` (and `persist.test.ts` if suitable) - Change: add cases.
4. Code: add `reorderTodo` to `TodoState` and the store; expose it from `useTodoList`; wire `onReorder` in `App.tsx`.
   Files: `src/stores/todo/base.ts`, `src/hooks/todo/use-todo-list.ts`, `src/App.tsx`.
5. Test: component test for keyboard reorder in `TodoList` via `userEvent` (focus handle, Space, ArrowDown, Space calls `onReorder(0, 0, 1)`); handle has an accessible label such as "Reorder <title>"; clicking checkbox/Edit/Delete does not trigger reorder.
   Files: `src/components/todo/TodoList/index.test.tsx`, `src/components/todo/TodoItem/index.test.tsx`.
6. Code: add dependencies with pnpm. `TodoList` wraps items in `DndContext` (PointerSensor with small activation distance, KeyboardSensor with `sortableKeyboardCoordinates`, `closestCenter`, screen-reader announcements/labels) and `SortableContext` (vertical list strategy); on drag end ignore missing `over` or same id, else call `onReorder`. `TodoItem` uses `useSortable`, applies transform/transition, and renders a drag handle button with listeners and attributes only on the handle.
   Files: `package.json`, `pnpm-lock.yaml`, `src/components/todo/TodoList/index.tsx`, `src/components/todo/TodoItem/index.tsx`.
7. Stories: update `TodoItem` (with handle) and `TodoList` (reorderable / reordered state) stories.
   Files: `src/components/todo/TodoItem/index.stories.tsx`, `src/components/todo/TodoList/index.stories.tsx`.

## Done check
- `pnpm test`, `pnpm lint`, `pnpm build` all exit 0
- Keyboard reorder, helper and store action are covered by passing tests
- `preview_start` the `storybook` config, check the TodoList story, no console errors, screenshot taken
