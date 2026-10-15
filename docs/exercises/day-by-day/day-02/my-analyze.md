# My Analyze — Todo App Tickets

My personal analysis of the 5 tickets in [tickets.md](tickets.md).

---

## TODO-101 — Bug

**It asks:** A task is marked as completed, but after reloading it is treated as not completed.

**Ambiguous:**
- Where is the data stored (localStorage or backend)?

**First step:** Reproduce the bug using the `Steps to reproduce`.

**Questions for BA/QA:**
- Are completed tasks remembered when the user switches to another browser, or are they only stored in the current browser?

---

## TODO-102 — Bug

**It asks:** The bug is about not checking for an empty title.

**Ambiguous:**
- Does the edit title flow have a similar bug?

**First step:** Reproduce the bug using the `Steps to reproduce`, and test the edit flow myself at the same time. Only ask BA/QA about the title trim policy.

**Questions for BA/QA:** None.

---

## TODO-103 — Bug

**It asks:** A wrong task is deleted when in filter mode.

**Ambiguous:** Everything is clear.

**First step:** Check the list rendering condition in the component responsible for rendering, and see whether deletion is based on id or index.

**Questions for BA/QA:** None.

---

## TODO-104 — Feature

**It asks:** Add a due date to a task.

**Ambiguous:**
- What happens when I set the due date to a day in the past (is it set successfully or highlighted in red) when creating a new task?
- When editing, can a past date be chosen?

**First step:** Chat with BA/QA to clarify choosing a past date when creating a task.

**Questions for BA/QA:**
- The due date feature allows picking a past date, but what happens to that task? Is it considered overdue and highlighted in red?
- When editing, can a past date be chosen?

---

## TODO-105 — Feature

**It asks:** Add a feature to search by title.

**Ambiguous:** Clear.

**First step:** Start coding.

**Questions for BA/QA:** None.
