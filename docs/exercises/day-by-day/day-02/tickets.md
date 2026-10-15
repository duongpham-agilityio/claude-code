# Tickets — Todo App

Product: simple Todo/Task web app (create, edit, complete, delete, filter tasks).

---

## TODO-101 — Bug

- **Title:** Completed task reappears as active after page refresh
- **Type:** Bug
- **Priority:** High
- **Severity:** Major (data not persisted)
- **Description:** User marks a task as completed, but after reloading the page the task is shown as active again.
- **Steps to reproduce:**
  1. Open the app and create a task "Buy milk".
  2. Click the checkbox to mark it completed (task is crossed out).
  3. Refresh the browser (F5).
- **Expected:** Task stays completed after refresh.
- **Actual:** Task is shown as active (not crossed out).
- **Environment:** Chrome 129, Windows 11

---

## TODO-102 — Bug

- **Title:** App accepts empty task title consisting only of spaces
- **Type:** Bug
- **Priority:** Medium
- **Severity:** Minor (validation gap)
- **Description:** Creating a task with a title of only whitespace succeeds and adds a blank row to the list.
- **Steps to reproduce:**
  1. Click "Add task".
  2. Type 3 spaces in the title field.
  3. Press Enter.
- **Expected:** Error message "Title is required"; no task created.
- **Actual:** Blank task is created in the list.
- **Environment:** Firefox 130, macOS 14

---

## TODO-103 — Bug

- **Title:** Deleting a task deletes the wrong task when a filter is active
- **Type:** Bug
- **Priority:** Critical
- **Severity:** Critical (user data loss)
- **Description:** With the "Completed" filter on, clicking delete on a task removes a different task from the full list.
- **Steps to reproduce:**
  1. Create 3 tasks: A, B, C. Mark B and C as completed.
  2. Select the "Completed" filter (shows B, C).
  3. Click delete on C.
- **Expected:** Only C is deleted.
- **Actual:** Task B is deleted instead (C is index 1 in the filtered list, which maps to B at index 1 in the full list); C remains.
- **Environment:** Chrome 129, macOS 14
- **Note:** Not reproducible when the filter is "All".

---

## TODO-104 — Feature

- **Title:** Add due date to tasks
- **Type:** Feature
- **Priority:** Medium
- **User story:** As a user, I want to set a due date on a task so that I know when it must be done.
- **Acceptance criteria:**
  - [ ] Task form has an optional "Due date" date picker.
  - [ ] Due date is shown next to the task title in the list.
  - [ ] Tasks past their due date and not completed are highlighted in red.
  - [ ] Due date can be edited or cleared later.
  - [ ] Past dates are allowed when creating a task.
- **Out of scope:** Reminders / notifications.

---

## TODO-105 — Feature

- **Title:** Add search box to filter tasks by title
- **Type:** Feature
- **Priority:** Low
- **User story:** As a user with many tasks, I want to search by keyword so that I can find a task quickly.
- **Acceptance criteria:**
  - **Given** the task list has tasks "Buy milk" and "Call mom"
    **When** I type "mil" in the search box
    **Then** only "Buy milk" is displayed.
  - **Given** I typed a keyword
    **When** I clear the search box
    **Then** all tasks are displayed again.
  - Search is case-insensitive.
  - If nothing matches, show "No tasks found".
  - Search works together with the existing status filter (All / Active / Completed).
