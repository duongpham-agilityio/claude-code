# Ticket 91: Delete todo has no confirmation dialog

## Analysis
The ticket is a bug/behaviour change: clicking Delete on a todo (`TodoItem` calls `props.onRemove` immediately) should first show a confirmation dialog and delete only after the user confirms. It does not say what kind of dialog (native `window.confirm` vs custom modal), what the dialog says, or how cancel, keyboard and edit-mode cases behave, and the repo has no shared dialog component yet. First step: get the dialog type and copy confirmed, then add the confirm step in `TodoItem` (or its parent) with tests and a story.

## Clarifying questions
1. Should the dialog be the browser-native `window.confirm`, or a custom in-app modal?
   - Gap: Changes the build (a new shared `Dialog` component with styling, focus trap and stories vs one line) and how tests are written. `components/shared` only has `Button` today.
   - Default assumption: custom accessible modal (`role="alertdialog"`) matching the app's Tailwind style. Correct?
   - Answer: use `window.confirm`

2. What exact copy should the dialog use (title, message, button labels)? Should it show the todo title?
   - Gap: Needed for UI and for test queries by role/name.
   - Default assumption: message "Delete "<todo title>"? This cannot be undone." with buttons "Delete" and "Cancel". Correct?
   - Answer: The message like "The "<todo title>" will deleted and can not restore when you deleted?". Buttons are correct

3. How should the dialog be dismissed without deleting, and where should focus go?
   - Gap: Cancel button, Escape key and backdrop click are all plausible; focus on open (Cancel vs Delete) and focus return to the Delete button after close affect accessibility and tests.
   - Default assumption: Cancel button and Escape dismiss; backdrop click does not; initial focus on Cancel; focus returns to the row's Delete button. Correct?
   - Answer: Correct

4. Does the confirmation apply while the todo is in edit mode (Delete button is still visible then)? And are there any other delete paths that need it (bulk or "clear completed" actions)?
   - Gap: Scope of the change; unsaved edit draft could be lost on confirm.
   - Default assumption: confirm applies to every single-todo Delete click, including edit mode; no other delete paths exist. Correct?
   - Answer: Delete can applied while user on edit mode. The flow will appear like normal
