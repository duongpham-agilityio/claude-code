# Bug: Todos are lost after page reload
Status: REPRODUCED

## Environment
- Branch / commit: develop @ e559cb3
- Versions: Node v22.22.2, pnpm 10.33.0, react ^19.2.8, zustand ^5.0.16, vite ^8.3.0; OS macOS (Darwin 23.6.0); browser: Claude desktop built-in browser (Chromium)
- Source: https://github.com/duongpham-agilityio/claude-code/issues/89

## Setup
1. `preview_start` with config `dev` from `.claude/launch.json` (`pnpm dev`, port 5173).
2. Open http://localhost:5173/ — page loads, shows "Todo Practice", input "New todo", button "Add".
Setup notes: none

## Steps to reproduce
1. Open http://localhost:5173/.
2. Click the "New todo" input, type `Buy milk`, press Enter.
   List now shows `Buy milk` with Edit and Delete buttons.
3. Reload the page (navigate to http://localhost:5173/ again).

Reproduced: always (2 of 2 runs; run 2 used `Walk dog`)

## Expected
Todos are persisted and still shown after reload (ticket).

## Actual
List is empty and shows "No todos yet". The added todo is gone.

## Evidence
- After reload: page text is `Todo Practice / Add / No todos yet`.
- `Object.keys(localStorage)` = `[]`, `Object.keys(sessionStorage)` = `[]` (checked after run 1 reload).
- Console errors: none.
- `grep -rn "localStorage\|persist" src` returns no matches.

## Suspected area
Failing step: 3
Files:
```ts
// src/stores/todo/base.ts:19-20
export const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
```
Why: store is plain in-memory zustand state with no persistence layer, and nothing in `src/` reads or writes `localStorage`/`sessionStorage`, so state resets to `[]` on every load. This is a suspicion, not a proven root cause.

## Questions for the reporter
1. Where should todos persist: browser `localStorage`, or a backend/API? Assumed: not specified; only observed that nothing is stored client-side today.
2. Should completed state and edited titles also persist, not only newly added todos? Assumed: yes, whole list.

## Answers
1. Use localStorage.
2. yes, whole list.

Both assumptions above are confirmed by the reporter: persist the whole todo list (including done state and edited titles) in `localStorage`.
