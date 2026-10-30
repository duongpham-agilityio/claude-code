# Ticket 95: feat(todo): paginate the todo list (5 per page)

## What it asks
Feature. Paginate the todo list with a fixed page size of 5 (`TODO_PAGE_SIZE`), a Prev / Next / page-number control shown only when more than 5 todos exist, and `currentPage` in the Zustand store (not persisted).
Done when: 12 todos show 5 / 5 / 2 across pages; Prev/Next disable at the edges; `aria-current="page"` marks the current page; control hidden for 5 or fewer todos; removing the last todo on the last page clamps `currentPage`; reload resets to page 1 while todos persist.

## What's ambiguous
- "page numbers" with no limit: "Pagination control: Prev / Next buttons plus page numbers" and the story "many pages". Showing every number gets wide on a long list.
- "Adding a todo keeps the list correct (new todo appears at the top of page 1)": if the user is on page 3 when adding, should the view jump to page 1?
- "Pure helper (e.g. `paginate-todos.ts`)... page reset rules": which events reset the page besides reload is not listed.
- "New shared or todo component `Pagination`": location (`components/shared` vs `components/todo`) is left open.

## First step
Add `TODO_PAGE_SIZE` and the pure `paginate-todos.ts` helper (slice + clamp) with unit tests, then wire `currentPage` / `setPage` into `TodoState`.

## Clarifying questions
1. Should page numbers collapse with ellipsis on long lists?
   Default assumption: show all page numbers, no ellipsis. Correct?
   Answer: _(pending)_
2. When a todo is added while on page 2 or later, should the view jump to page 1?
   Default assumption: yes, `currentPage` is set to 1 so the new todo is visible. Correct?
   Answer: _(pending)_
3. Where should `Pagination` live?
   Default assumption: `components/shared/Pagination` (it has no todo-specific logic). Correct?
   Answer: _(pending)_
