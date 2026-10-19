# TODO-105: Search tasks by title (logic only)

## Goal
Pure logic to filter tasks by title keyword, composable with the existing status filter.

## Steps
1. Write failing tests in `src/todo/search.test.ts`.
2. Implement `searchTasks(tasks, query)` in `src/todo/search.ts`.
3. Run `pnpm test`, `pnpm lint`, `pnpm build`.

## Files
- `src/todo/search.ts` (new)
- `src/todo/search.test.ts` (new)
- `src/todo/todo.ts` is NOT changed; combine via `searchTasks(filterTasks(tasks, filter), query)`.

## Behavior
- Case-insensitive substring match on `title` ("mil" matches "Buy milk").
- Empty or blank query returns all tasks.
- No match returns `[]`.
- Works together with the status filter.

## Verify
`pnpm test`, `pnpm lint`, `pnpm build` all pass.

## Deferred (UI, no UI exists yet)
- Search box component.
- "No tasks found" message when the result is empty.
- Clearing the box shows all tasks again (logic covered by blank query; wiring is UI).
