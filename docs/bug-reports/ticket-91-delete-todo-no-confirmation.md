# Bug: Delete todo removes the item immediately, no confirmation
Status: REPRODUCED

## Environment
- Branch / commit: develop @ e89739e
- Versions: Node v22.22.2, pnpm 10.33.0, macOS 14.7.5, in-app browser pane (Chromium)
- Source: GitHub issue #91 (duongpham-agilityio/claude-code), analysis in `docs/analysis/ticket-91-delete-todo-confirmation-dialog.md`

## Setup
1. `preview_start` with config `dev` (`pnpm dev`, port 5173).
2. Open http://localhost:5173/ — page "Todo Practice" loads.
3. Before clicking Delete, stub `window.confirm` in the page to record calls (returns `false`), to detect any confirmation attempt.
Setup notes: none. App starts with one existing todo "Buy milk".

## Steps to reproduce
1. Open http://localhost:5173/.
2. In the "New todo" input type `Walk dog` and press Enter (todo appears in the list).
3. Click the "Delete" button on the "Walk dog" row.

Reproduced: always (2 of 2 runs; run 2 used `Read book` and a programmatic click).

## Expected
A confirmation appears (per reporter answer: `window.confirm`, message `Delete "<todo title>"? This action cannot be undone.`); the todo is deleted only after the user confirms. Cancel keeps the todo.

## Actual
The todo disappears at once. List text after click: `Todo Practice / Add / Buy milk / Edit / Delete`. With `window.confirm` stubbed to return `false`, it was never called (`confirmCalls: []`), and the todo was still deleted.

## Evidence
- Run 1 (`Walk dog`): `confirmCalls: []`, todo gone after click.
- Run 2 (`Read book`): before = `Read book, Buy milk`; after = `Buy milk`; `confirmCalls: []`.
- Console errors: none.

## Suspected area
Failing step: 3
Files:
```tsx
// src/components/todo/TodoItem/index.tsx:110
onClick={() => props.onRemove?.(props.todo.id)}
```
```ts
// src/hooks/todo/use-todo-list.ts:37-39
const removeTodo = (id: Todo["id"]): void => {
  try {
    removeTodoFromStore(id);
```
Why: Delete button calls `onRemove` directly, and the hook forwards straight to the store; no confirm step exists anywhere on the path (`confirm` never called when stubbed). This is a suspicion, not a proven root cause.

## Questions for the reporter
None open. Reporter answers (in analysis doc): use `window.confirm`; Cancel/Escape dismiss; confirm also applies in edit mode. The reporter's wording for question 2 (`The "<todo title>" will deleted and can not restore when you deleted?`) is ungrammatical — assumption used: replace with the cleaner `Delete "<todo title>"? This action cannot be undone.` (same meaning, same quoted title); reporter to confirm.
