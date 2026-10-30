# Ticket 96: feat(todo): reorder todos by drag and drop

## Analysis
The ticket asks for drag-and-drop (and keyboard) reordering of `TodoItem`s inside the visible page, written back into the full `todos` array and persisted by the existing `persist` middleware. Nothing is ambiguous: scope, acceptance criteria, the helper signature `reorderTodos(todos, pageStart, fromIndex, toIndex)` and the file locations are all given. The only caveat is the dependency on #95 (pagination), which is not in `develop` yet, so the first step is to implement against the current un-paginated list with `pageStart = 0` and keep the helper pure so a real page offset works later.

## Clarifying questions
No ambiguity. Scope, acceptance criteria and implementation notes are explicit.

Dependency note (not a question): #95 is not merged. Until it lands, `TodoList` receives the whole `todos` array (page = whole list, `pageStart = 0`). `TodoList` takes an optional `pageStart` prop (default 0) and calls `onReorder(pageStart, fromIndex, toIndex)`, so after rebasing on #95 the page container only needs to pass its real offset. Expect merge conflicts in `TodoList`, `use-todo-list.ts`, `base.ts` and `App.tsx`.
