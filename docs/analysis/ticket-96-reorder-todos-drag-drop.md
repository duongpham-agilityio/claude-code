# Ticket 96: feat(todo): reorder todos by drag and drop

## What it asks
Feature. Let users reorder todos on the current page by drag and drop (pointer and keyboard) using `@dnd-kit`, write the new order into the full `todos` array, and keep it after reload via the existing `persist` middleware.
Done when: dragging A below B swaps them in UI and store; other pages keep relative order; keyboard reorder works; reload keeps the order; dropping on itself or outside changes nothing; edit/toggle/remove still work and buttons/inputs do not start a drag; no console errors.

## What's ambiguous
- "`reorderTodos(todos, pageStart, fromIndex, toIndex)`": it is not stated whether indexes are relative to the page or to the full array. The name `pageStart` suggests page-relative indexes.
- "with accessible labels": the exact label text of the drag handle and announcements is not given.
- "Depends on #95 (pagination)": this ticket is built on top of the #95 branch, which is not merged into `main` yet.

## First step
Add `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` and write the pure `reorderTodos` helper with tests.

## Clarifying questions
1. Are `fromIndex` and `toIndex` relative to the page slice?
   Default assumption: yes, page-relative; the helper adds `pageStart` to get full-array positions. Correct?
   Answer: _(pending)_
2. What label should the drag handle have?
   Default assumption: `Drag to reorder <title>`. Correct?
   Answer: _(pending)_
3. Should this PR target the #95 branch until #95 is merged?
   Default assumption: yes, the PR targets `feat/paginate-todo-list`. Correct?
   Answer: _(pending)_
