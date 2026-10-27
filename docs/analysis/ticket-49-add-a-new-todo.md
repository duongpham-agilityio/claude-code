# Ticket 49: Add a new todo

## Analysis
The ticket asks for a text input plus an `Add` button above the todo list that creates a todo (unique `id`, trimmed title, `done: false`) on click or Enter, clears the input, and blocks empty or whitespace-only titles, with the create logic in a plain unit-testable function. The ticket was ambiguous about where the add logic lives, how `id` is generated, how empty titles are handled (the `Title is required` message), and list order, and the reporter has now resolved all of it: logic goes through `useTodoList` and the todo store, `id` is `crypto.randomUUID()`, the `Add` button is disabled for invalid titles instead of showing a message, and new todos go to the top. The first step is to write the failing unit test for the create function (trim, reject empty), then wire the input component.

## Clarifying questions
1. The "Blocked by" ticket ("Render todo list on UI") is already merged: `useTodoStore` holds `todos: Todo[]` and `useTodoList` only exposes `todos`. Should the new todo be added through a store action exposed by `useTodoList` (for example `addTodo(title)`), with the plain create function used by that action? Default assumption: yes, the plain function returns a `Todo` or an error, the store action appends it, and the hook exposes the handler. Correct?
   - Gap: Decides where state changes live and which layer the unit and component tests target.
   - Answer: Yes. The plain create function is called by a store action; `useTodoList` exposes the handlers (add) and already uses the todo store.

2. How should the unique `id` be generated? Default assumption: `crypto.randomUUID()` as a `string`, consistent with ticket 48 (UUID `id`). Correct?
   - Gap: Fixes the id format and how tests assert uniqueness (they cannot assert a fixed value unless the generator is injectable or mocked).
   - Answer: Yes. `crypto.randomUUID()`, type `string`.

3. When does `Title is required` appear and disappear? Default assumption: shown only after an add attempt with an empty or whitespace-only title, hidden again as soon as the user types. Correct? Should the message be announced to screen readers (for example `role="alert"`)?
   - Gap: Validation timing and accessibility change the markup and the component tests (role queries).
   - Answer: Changed after team discussion: the `Add` button is disabled while the title is empty or whitespace-only, so `Title is required` is no longer shown and `role="alert"` is not needed. Pressing Enter with an invalid title is silently ignored (no todo added, no alert, input value kept).

4. After a successful add, should the input keep focus so the user can add several todos in a row? And after a rejected add, what should happen to the input value (keep the spaces, or clear it)? Default assumption: focus stays in the input; on rejection the value is left as typed. Correct?
   - Gap: Changes the input behaviour and what the "input is empty after adding" test must cover.
   - Answer: Input keeps auto-focus after a successful add. The `alert(...)` is only for unexpected errors thrown while adding (caught in `catch`), not for validation; the typed value is kept in that case.

5. Is a duplicate title allowed (same title added twice), and is there a maximum title length? Default assumption: duplicates allowed, no max length. Correct?
   - Gap: Adds validation rules and error copy if the answer is no.
   - Answer: Duplicate titles are allowed. No maximum title length.

6. New todos are appended to the end of the list, correct? Should the `Add` button be disabled while the input is empty, or always enabled so the `Title is required` message can be reached by clicking? Default assumption: appended at the end, button always enabled.
   - Gap: A disabled button would make the error path unreachable by click and would contradict the acceptance criteria.
   - Answer: New todos are added at the top of the list (newest first). The `Add` button is disabled when the title is empty or whitespace-only.

## Resolved notes
- The create function still trims the title and throws `Error("Title is required")` on empty input (required by the ticket's unit test); the UI guard means this is only a safety net, and the handler's `catch` shows `alert(error.message)`.
- The original acceptance criterion "empty title shows `Title is required`" is superseded by the disabled button; the component test checks the disabled state and silent Enter instead.
