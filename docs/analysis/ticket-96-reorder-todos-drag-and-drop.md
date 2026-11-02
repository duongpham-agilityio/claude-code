# Ticket 96: feat(todo): reorder todos by drag and drop

## What it asks
Feature: let users reorder todos by drag and drop (pointer and keyboard) with a drag handle, write the new order into the full `todos` array, and keep it after reload via the existing `persist` middleware.
Done when: dragging A below B swaps them in UI and store; other pages keep their order; keyboard reorder works; reload keeps order; dropping on self/outside changes nothing; edit/toggle/remove still work and buttons/inputs do not start a drag; no console errors.

## What's ambiguous
- "Depends on #95 (pagination): reordering works inside the visible page." Pagination is not in `develop`. Quote: "Drag a `TodoItem` to a new position within the current page."
- "Add ... `@dnd-kit/utilities` if needed." Whether it is needed depends on using `CSS.Transform`.

## First step
Write the pure helper `reorderTodos(todos, pageStart, fromIndex, toIndex)` in `src/stores/todo/reorder-todo.ts` with unit tests.

## Clarifying questions
1. Pagination (#95) is not merged. Should reordering ship now against the full list?
   Default assumption: Yes. With no pagination `pageStart` is 0 and the whole list is the page; `TodoList` takes an optional `pageStart` prop (default 0) so it becomes page-aware once #95 lands. Correct?
   Answer: _(pending)_
2. Should `@dnd-kit/utilities` be added?
   Default assumption: Yes, for `CSS.Transform.toString`. Correct?
   Answer: _(pending)_
