# TODO-102: reject blank task title

## Goal
`createTask` must throw `Error('Title is required')` when the title is empty or whitespace-only. No task is created. A valid title is kept unchanged.

## Steps
1. Add failing tests for `createTask('   ')`, `createTask('')` and a normal title.
2. Validate the trimmed title in `createTask`; throw before incrementing `nextId`.
3. Keep the original (untrimmed) title when valid.

## Files to change
- `src/todo/todo.ts`
- `src/todo/todo.test.ts`

## How to verify
- `pnpm test`, `pnpm lint`, `pnpm build` all pass.
