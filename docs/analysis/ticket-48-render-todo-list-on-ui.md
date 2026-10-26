# Ticket 48: Render todo list on UI

## Analysis
The ticket asks for a feature that defines a `Todo` shape (`id`, `title`, `done`), keeps an initially empty todo list in the top-level component, and renders one list item per title with a `No todos yet` message when the list is empty. The state location and styling instructions are ambiguous, and the tests and the done flag leave open how todos get into the list and whether `done` is shown. The first step is to get answers on state location and component structure, then build the `Todo` type and the list rendering, starting with the empty-state test.

## Clarifying questions
1. The ticket says to keep the list in state in the top-level component. The project already has a placeholder hook (`use-todo-list.sample.ts`, using `useState`) and plans to move to a Zustand store later. Should the state live directly in `App` with `useState`, or in the existing todo-list hook (or store)?
   - Gap: Decides where the state and the `Todo` type live and what later tickets build on; "do it first, base for other tasks" makes this choice costly to change.
   - Answer: Put the state in a Zustand store, plus a custom hook that calls that store. The custom hook is responsible for exposing the state and the handlers for the list.

2. The ticket requires "each title rendered as a list item" and tests for "one item per todo", but the list starts empty and sample todos must be removed before the PR. How should tests supply todos: may the list be a separate component that receives `todos` as a prop (so tests pass todos directly)? Default assumption: yes, a presentational list component takes a `todos` prop and `App` owns the state. Correct?
   - Gap: Without a way to inject todos, the "renders one item per todo" test cannot be written against an empty initial state.
   - Answer: Agreed. A presentational list component takes a `todos` prop; `App` calls the hook and passes the todos down.

3. "Plain HTML is enough, no styling needed." Should this be plain unstyled elements, or should it use Tailwind utility classes like the rest of the project? Default assumption: plain semantic HTML (`ul`/`li`), no classes. Correct?
   - Gap: Affects markup and any Storybook story/visual expectations.
   - Answer: Use Tailwind CSS together with HTML tags. Note: semantic tags are mandatory.

4. Should the UI show anything for `done` (for example strikethrough or a checkbox), or only the title for now? Default assumption: only the title; `done` is stored but not displayed. Correct?
   - Gap: Determines whether the `done` field has any rendered behavior or test coverage in this ticket.
   - Answer: This ticket must handle the styling for both states of a todo: done and not done. A done todo must have a strikethrough title; the rest of the styling is optional, as long as the user can tell the todo is done. A not-done todo is shown normally, with no strikethrough. The flow for changing state (toggle) is out of scope; this ticket only handles displaying the state of a todo. Nothing else is needed.

5. What should the heading text be (acceptance says "a heading" without wording)? Default assumption: "Todo list" as an `h1`. Correct?
   - Gap: Tests querying the heading by role/name need exact text.
   - Answer: The heading is the app name; use "Todo Practice".

6. What type should `id` have (string or number)? Default assumption: `string`. Correct?
   - Gap: Fixes the `Todo` type that later tickets (add, toggle, delete) depend on.
   - Answer: `id` is a UUID, so it is unique, with type `string`.
