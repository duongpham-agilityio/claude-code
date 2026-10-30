# Ticket 50: Update a todo

## Analysis
The ticket asks for an `Edit` button on each todo row that swaps the title for a prefilled input with `Save` and `Cancel`, where `Save` updates only that todo's title and an empty title cannot be saved, backed by a unit-tested update function. The reporter has resolved the ambiguity: an empty title disables `Save` and silently ignores Enter (no `Title is required` message, matching ticket 49), the title is trimmed, and the remaining scope is the store action, its wiring to `TodoList`, and tests and stories, since `TodoItem` already contains the edit UI. The first step is to write the failing unit test for the update function (changes only the todo with the given id), then add `updateTodo` to `useTodoStore` and expose it through `useTodoList`.

## Clarifying questions
1. How should an empty title be handled while editing? The ticket says it "shows `Title is required`", but for ticket 49 the team chose a disabled `Add` button with no message, and `TodoItem` currently disables `Save` for an empty or whitespace-only draft. Default assumption: same as adding. `Save` is disabled and Enter is silently ignored, no message is shown, and the update function still throws `Title is required` as a safety net. Correct, or must the message be visible?
   - Gap: Changes the markup, the acceptance criterion "shows `Title is required`" and the component test for the empty-title case.
   - Answer: Yes. When the title is empty or whitespace-only, `Save` is disabled and Enter is silently ignored; no message is shown.

2. `TodoItem` already renders `Edit`, `Save`, `Cancel` and calls `onEdit(id, title)`. Is the remaining scope of this ticket only the store action (for example `updateTodo(id, title)` exposed through `useTodoList`), wiring it to `TodoList`, and the tests and stories? Default assumption: yes, and the plain update function is called by the store action like `createTodo`. Correct?
   - Gap: Decides which layers get built and which tests the ticket owns (unit for the update function, store/hook, component).
   - Answer: Yes. Remaining scope is the store action (for example `updateTodo(id, title)` exposed through `useTodoList`), wiring it to `TodoList`, and the tests and stories. The plain update function is called by the store action like `createTodo`.

3. Should the saved title be trimmed (as when adding), and what happens when the trimmed title equals the current title? Default assumption: trimmed, and saving an unchanged title just closes the editor without error. Correct?
   - Gap: Defines the stored value and an edge case for the "Save updates the title" test.
   - Answer: Yes, trim the title. Saving an unchanged title is allowed and behaves like any other save (keep it simple, no special case).

4. What should happen if the todo id does not exist when updating (for example removed in the meantime)? Default assumption: the list is returned unchanged with no error. Or should it throw?
   - Gap: Defines the update function's contract and the "other todos are not changed" unit test.
   - Answer: This case cannot happen because todos are stored only locally. No handling needed.

5. Keyboard and multi-row behaviour: is Enter = `Save` and Escape = `Cancel` expected, and may several rows be in edit mode at the same time? Default assumption: yes to both, each row keeps its own edit state, and the `done` state is untouched by an edit. Correct?
   - Gap: Affects accessibility, the component tests (`userEvent` keyboard cases) and whether opening a second editor must cancel the first.
   - Answer: Not needed. No special handling for several rows in edit mode; the user must click Save/Cancel.

6. Answer 1 says "silent Enter" (Enter on an empty title is ignored, so Enter acts as Save), while answer 5 says keyboard cases need no handling and the user must click Save/Cancel. `TodoItem` currently has Enter = Save and Escape = Cancel. Keep these two shortcuts as they are (no dedicated tests), or remove them so only the `Save`/`Cancel` buttons work? Default assumption: keep the existing code, add no tests for them. Correct?
   - Gap: Decides whether `TodoItem` changes (removing `onKeyDown`) and whether a component test for Enter/Escape is needed.
   - Answer: Keep the existing Enter = Save and Escape = Cancel in `TodoItem` as they are; no dedicated tests for them.

## Resolved notes
- The original acceptance criterion "empty title shows `Title is required`" is superseded by the disabled `Save`; the component test checks the disabled state and silent Enter instead. The update function still trims and throws `Error("Title is required")` on empty input as a safety net.
- Saving an unchanged title is a normal save. An unknown id is not a real case (local-only data), so the unit test only covers "changes only the todo with the given id".
- `TodoItem` keeps Enter = Save and Escape = Cancel as is; multiple rows in edit mode are not handled specially. No extra tests for these.
