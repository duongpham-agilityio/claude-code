# Ticket 51: Remove a todo

## Analysis
The ticket asks for a `Delete` button on each todo row that immediately removes only that todo (no confirmation), shows `No todos yet` when the last one is deleted, and puts the removal logic in a plain, unit-testable function. The reporter's answers settle persistence, the blocking ticket, the button's accessible name and the failure behaviour, so no ambiguity remains. The first step is to write the pure remove function with its unit test, then wire it into `useTodoStore` and the `Delete` button.

## Clarifying questions
1. The ticket is "Blocked by" "Render todo list on UI". Is that ticket finished, and does the `No todos yet` empty state already exist there, or must this ticket add it?
   - Gap: if the empty state is missing, this ticket grows (new UI + test); if the blocker is not merged, there is no row to attach `Delete` to.
   - Default assumption: blocker is merged and already renders `No todos yet` for an empty list. Correct?
   - Answer: The blocking ticket is done.

2. Should a deletion persist after a page reload (e.g. localStorage or a backend), or is in-memory state enough for now?
   - Gap: decides whether any storage code and persistence tests are in scope.
   - Default assumption: in-memory only, same as current todo state. Correct?
   - Answer: Only work with the current store (`useTodoStore`).

3. Every row will show the same `Delete` text. Should each button have a per-todo accessible name (e.g. `Delete "Buy milk"`), or just `Delete`?
   - Gap: affects accessibility and how the component test finds the button for one specific row.
   - Default assumption: visible text `Delete`, with an accessible label that includes the todo title. Correct?
   - Answer: Yes. Use an accessible label for screen readers; the visible UI text is just `Delete`.

4. If the remove function receives an id that is not in the list, should it return the list unchanged?
   - Gap: defines the unhappy-path behaviour and its unit test.
   - Default assumption: return the list unchanged, no error. Correct?
   - Answer: If the id is not in the list, show an alert warning that something went wrong while deleting and asking the user to try again.

5. Answer #4 asks for an "alert" when the id does not exist. Is it a browser `window.alert()` dialog or an in-page error message (e.g. a `role="alert"` region or toast)? What is the exact message?
   - Gap: the codebase has no alert/toast pattern yet; each choice changes the UI, how it is tested (mock `window.alert` vs query by role) and the stories.
   - Default assumption: inline in-page message with `role="alert"`, text `Could not delete the todo. Please try again.`. Correct?
   - Answer: Use `window.alert` with the message `Could not delete the todo. Please try again.`

6. When a delete fails (id not found), should the todo list stay unchanged, and should the alert auto-dismiss or be closable (auto-hide after a few seconds, close button, or only cleared on the next successful delete/add)?
   - Gap: decides the lifecycle of the error state in the store/component and its tests.
   - Default assumption: list unchanged; alert stays until the user's next successful delete. Correct?
   - Answer: On failure the todo list stays unchanged, and the alert is left for the user to close (native `window.alert` dismissal).
