# Bug: Deleting a task with the "Completed" filter active deletes the wrong task
Status: NOT REPRODUCIBLE
WARNING: The bug did NOT reproduce. The running app has no task list, filter or delete button, so the ticket steps cannot be performed.

## Environment
- Branch / commit: feat/bug-report-agent @ 95b0d61
- Versions: Vite dev server on port 5173; OS / browser: Browser pane of the Claude tooling (not Chrome 129 / macOS 14 as in the ticket; exact version not observed)
- Source: ticket TODO-103 (provided in the task message)

## Setup
1. `preview_start` with entry `dev` from `.claude/launch.json` (`pnpm dev`, port 5173).
2. Opened http://localhost:5173/ and confirmed it loads.
3. Stopped the server with `preview_stop` at the end.
Setup notes: none. Console shows only vite connect messages and the React DevTools hint.

## Steps to reproduce
Not reproducible as written. What was tried:
1. Loaded http://localhost:5173/. Page text is only "EmailPasswordLogin"; the accessibility tree has no interactive elements. `src/App.tsx` renders only `<LoginForm />`. There is no way to create tasks A, B, C, no "Completed" filter and no delete button, so ticket steps 1-3 cannot be done through the UI.
2. Per scope, no other path was tried (no calling code from the console).

Reproduced: no (0 of 1 attempts; step 1 of the ticket is impossible in the UI).

## Expected
Only C is deleted (tasks left: A, B; the Completed view shows B).

## Actual
Not observed. No UI exists to perform the ticket steps.

## Evidence
- Page text of http://localhost:5173/: `EmailPasswordLogin`
- `src/App.tsx:3`: `export const App = () => <LoginForm />`
- Console: no errors.

## Suspected area
Failing step: 1 (cannot create tasks; no todo UI is rendered).
Files:
```ts
// src/todo/todo.ts:33-35
const target = filterTasks(tasks, filter)[visibleIndex]
if (!target) return tasks
return tasks.filter((task) => task.id !== target.id)
```
Why: Reading the code (not a run), `removeTask` maps the visible index to the task and removes it by id, which would delete C in the ticket scenario. The ticket describes a filtered index being applied to the full list; that was not found here. `src/todo/todo.ts` is not used by any rendered screen. This is a suspicion, not a proven root cause: the bug may live in another branch or in a todo UI that is not present here.

## Questions for the reporter
1. Which branch / commit / deployed build did you see this on? Assumption: this branch (95b0d61), where only the login form is rendered.
2. Where is the todo UI (URL or screen)? Assumption: none exists on this branch.
3. Does the delete in your build call something other than `removeTask(tasks, filter, visibleIndex)` in `src/todo/todo.ts`, for example with a full-list index? Assumption: unknown.
4. Was `removeTask` changed after the ticket was written? Assumption: unknown.
5. Does the environment (Chrome 129, macOS 14) matter? Assumption: no.
