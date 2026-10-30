# Ticket 95: feat(todo): paginate the todo list (5 per page)

## What it asks
Feature: paginate the todo list, fixed 5 per page, with Prev / Next / page-number control and `currentPage` in the Zustand todo store.
Done when: 12 todos show 5/5/2 across 3 pages; Prev/Next disabled at the edges; `aria-current="page"` on current page; control hidden for 5 or fewer todos; removing the last todo on the last page moves back to the last valid page; reload resets to page 1 while todos persist.

## What's ambiguous
- "Adding a todo keeps the list correct (new todo appears at the top of page 1)": unclear whether adding while on page 2+ should jump to page 1.
- "Pure helper (e.g. `paginate-todos.ts`...)": location of the `Pagination` component ("shared or todo component") is open.

## First step
Add `TODO_PAGE_SIZE` to `src/constants` and the pure `paginate-todos.ts` helper with tests.

## Clarifying questions
1. When a todo is added while the user is on page 2 or later, should the view jump to page 1?
   Default assumption: Yes, `currentPage` resets to 1 on add so the new todo is visible. Correct?
   Answer: _(pending)_
2. Should `Pagination` live in `components/shared` or `components/todo`?
   Default assumption: `components/shared` (generic, no todo-specific props). Correct?
   Answer: _(pending)_
