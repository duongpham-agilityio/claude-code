# Ticket 95: feat(todo): paginate the todo list (5 per page)

## What it asks
Feature: paginate the todo list, fixed 5 per page, with Prev / Next and page numbers. `currentPage` lives in the Zustand store (not persisted).
Done when: 12 todos show as 5 / 5 / 2; Prev/Next disabled at the ends; `aria-current="page"` on the current page; control hidden with 5 or fewer todos; removing the last todo on the last page clamps `currentPage`; reload resets to page 1.

## What's ambiguous
- "New todos are added to the top of the list ... so they show on page 1": if the user is on page 3 and adds a todo, does the view jump to page 1? The criteria only say the todo "appears at the top of page 1".
- "page numbers": with many pages, show all numbers or a window with ellipsis? The story asks for a "many pages" case but no rule is given.
- "Removing the last todo on the last page moves `currentPage` back": other removals/edge cases (e.g. all todos removed) are not stated; page 1 is assumed.

## First step
Add `TODO_PAGE_SIZE` and the pure `paginate-todos.ts` helper (slice + clamp) with unit tests, then wire `currentPage` / `setPage` into the store.

## Clarifying questions
1. When a todo is added while the user is on page 2 or later, should the view jump to page 1?
   Default assumption: Yes, `addTodo` resets `currentPage` to 1. Correct?
   Answer: _(pending)_
2. With many pages, should all page numbers render, or a window with ellipsis?
   Default assumption: Render all page numbers (no ellipsis). Correct?
   Answer: _(pending)_
