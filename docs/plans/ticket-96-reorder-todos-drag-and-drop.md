# Plan: Reorder todos by drag and drop

Goal: Let users reorder todos within the visible page by pointer drag or keyboard, write the order back into the full `todos` array, and keep it after reload.

## Assumptions / out of scope
- #95 (pagination) is not in `develop`. Page = whole list, `pageStart = 0` for now; `TodoList` gets an optional `pageStart` prop (default 0). The helper stays pure so a real offset works after rebase.
- New dependencies `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` are required by the ticket itself.
- Cross-page dragging is out of scope. No new storage key; `partialize` already persists the ordered `todos`.
- Out-of-range or equal indexes return the same array (no-op).

## Steps
1. Test: reorder helper
   - Files: `src/stores/todo/__test__/reorder-todo.test.ts`
   - Change: cover move within page, first/last, same index (unchanged), non-zero `pageStart` offset leaving other pages untouched, out-of-range no-op, input not mutated.
   - Suggested commit: `test(todo): cover reorderTodos helper`
2. Code: reorder helper
   - Files: `src/stores/todo/reorder-todo.ts`, `src/stores/todo/index.ts`
   - Change: pure `reorderTodos(todos, pageStart, fromIndex, toIndex)` moving the item at `pageStart + fromIndex` to `pageStart + toIndex`; export it.
   - Suggested commit: `feat(todo): add reorderTodos helper`
3. Test + code: store action and hook
   - Files: `src/stores/todo/__test__/reorder-todo-action.test.ts`, `src/stores/todo/base.ts`, `src/hooks/todo/use-todo-list.ts`
   - Change: add `reorderTodo(pageStart, fromIndex, toIndex)` to `TodoState`, persisted order check, expose from `useTodoList`.
   - Suggested commit: `feat(todo): add reorderTodo store action`
4. Test: keyboard reorder in list and item handle
   - Files: `src/components/todo/TodoList/index.test.tsx`, `src/components/todo/TodoItem/index.test.tsx`
   - Change: focus handle, Space, ArrowDown, Space calls `onReorder(0, 0, 1)`; handle has accessible label; edit/toggle/remove still work.
   - Suggested commit: `test(todo): cover keyboard reorder`
5. Code: UI
   - Files: `src/components/todo/TodoList/index.tsx`, `src/components/todo/TodoItem/index.tsx`, `src/App.tsx`
   - Change: `DndContext` (PointerSensor with small distance, KeyboardSensor with sortable coordinates) + `SortableContext` + `verticalListSortingStrategy`; `TodoItem` uses `useSortable` with a drag handle button labelled `Reorder <title>`; `App` passes `onReorder`.
   - Suggested commit: `feat(todo): reorder todos by drag and drop`
6. Stories
   - Files: `src/components/todo/TodoItem/index.stories.tsx`, `src/components/todo/TodoList/index.stories.tsx`
   - Change: show handle; add reordered story with keyboard play function.
   - Suggested commit: `docs(todo): add reorder stories`

## Files to change
- `package.json`, `pnpm-lock.yaml`
- `src/stores/todo/reorder-todo.ts`, `src/stores/todo/index.ts`, `src/stores/todo/base.ts`
- `src/stores/todo/__test__/reorder-todo.test.ts`, `src/stores/todo/__test__/reorder-todo-action.test.ts`
- `src/hooks/todo/use-todo-list.ts`
- `src/components/todo/TodoList/index.tsx` (+ test, stories)
- `src/components/todo/TodoItem/index.tsx` (+ test, stories)
- `src/App.tsx`
