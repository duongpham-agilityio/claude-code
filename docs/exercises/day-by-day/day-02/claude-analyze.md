# Claude Analyze — Todo App Tickets

Claude's analysis of the 5 tickets in [tickets.md](tickets.md), to compare with [my-analyze.md](my-analyze.md).

How to read: each ticket has 3 parts (It asks / Ambiguous / First step). The **Why** line explains the reasoning, which is the part to learn from. The **Questions for BA/QA** section is a draft of the questions to send, with a default assumption so the dev is not blocked while waiting for an answer.

General principles for the analysis:
1. Check the AC / Notes of the ticket before asking, so you do not ask what the ticket already answers.
2. Do what you can yourself first (reproduce, read code, test). Only ask BA/QA what only they can answer.
3. Form a hypothesis about the cause so the first step has a direction.

---

## TODO-101 — Bug

**It asks:** A task marked as completed must stay completed after the page is refreshed.

**Ambiguous:**
- Where is task data stored (localStorage or backend)?
- Does the bug happen every time or only sometimes? Do other browsers besides Chrome 129 have it?

**First step:** Reproduce using the `Steps to reproduce`. After clicking the checkbox, open DevTools and check whether localStorage changes or a save request appears in Network.

**Why:** "Where it is stored" decides where to debug (client or server). Hypothesis: the toggle only changes in-memory state, or the save step fails.

**Questions for BA/QA:**
- **Q1 (QA):** Does the bug reproduce 100% of the time or only sometimes? Does it happen on Firefox/Safari? Do both newly created and older tasks have the problem?
  - Context: the ticket only lists Chrome 129 / Windows 11.
  - Default if no answer: treat it as a 100% bug and test on Firefox as well.
- **Q2 (BA):** Does the completed state only need to survive a refresh in the same browser, or also when switching browser/device?
  - Context: Expected only says "stays completed after refresh".
  - Default: same browser only.
- *Not asked:* "localStorage or backend" because reading the code answers it.

---

## TODO-102 — Bug

**It asks:** Block creating a task when the title contains only spaces, and show the error "Title is required".

**Ambiguous:**
- Should a valid title with leading/trailing spaces be trimmed when saved?
- Does the edit title flow have the same bug? (can test it yourself)

**First step:** Reproduce using the steps, and test the edit flow yourself at the same time. Only ask BA/QA about the trim policy.

**Why:** Hypothesis: validation only checks for an empty string `""` without calling `trim()`. The edit flow can be tested in a few minutes, so there is no need to use the BA's time.

**Questions for BA/QA:**
- **Q1 (BA):** Should a valid title with leading/trailing spaces (for example "  Buy milk  ") be trimmed when saved, or kept as is?
  - Context: the ticket only says to block titles made of spaces.
  - Default: trim on save.
- **Q2 (QA, only ask if testing shows the edit flow is also broken):** Fix it in this ticket or split it into a new ticket?
  - Default: fix in this ticket since the cause is the same validation.
- *Not asked:* whether the edit flow has the bug, because it can be tested directly.

---

## TODO-103 — Bug

**It asks:** Delete the task that was clicked while a filter is active; currently a different task is deleted.

**Ambiguous:** Clear. The ticket has repro steps, expected, actual, and the note "filter All is not affected".

**First step:** Check whether the delete handler uses the index from the filtered list to delete from the full list. Change it to delete by `id`. Then check whether toggle and edit have the same kind of bug, and add a regression test.

**Why:** The note "All is not affected" is a clue: the index only goes out of sync when the list is filtered. This is a data-loss bug (Critical), so check the scope of impact instead of fixing just one place.

**Questions for BA/QA:** None, since the ticket has enough information.

---

## TODO-104 — Feature

**It asks:** Add an optional due date to a task: display it, highlight in red when overdue, and allow editing or clearing it.

**Ambiguous:** (questions the ticket already answers are removed: "create with a past date" is already allowed in the AC)
- When editing, can a past date be chosen? (the ticket only says this for creation)
- Is a task due exactly today highlighted in red?
- Is a completed task that is past its due date highlighted in red? (the AC says "not completed", so probably not, but needs confirmation)
- Which timezone is used to store and compare dates?
- How are existing tasks without a due date handled? (backward compatibility with old data)

**First step:** Re-read the AC, cross out the questions that are already answered, and send the remaining ones to BA/QA in one batch. In parallel, look at the current task schema to add a `dueDate` field.

**Why:** Asking again what the ticket already says wastes time and costs credibility. Sending questions in one batch is better than asking piecemeal.

**Questions for BA/QA:**
- **Q1 (BA):** When editing a task, can a due date in the past be chosen?
  - Context: the AC only allows past dates when creating.
  - Default: allowed, same as on creation.
- **Q2 (BA):** Is a task whose due date is exactly today highlighted in red?
  - Context: the AC says "past their due date".
  - Default: no, only highlight when the due date is before today.
- **Q3 (BA):** Is a completed task that is past its due date highlighted in red?
  - Context: the AC says "not completed", so it seems not, but needs confirmation.
  - Default: not highlighted.
- **Q4 (BA):** Which timezone is the due date based on (the user's or a fixed one)? Is a time needed, or only a date?
  - Default: the user's local time, store the date only.
- **Q5 (BA):** Existing tasks without a due date show nothing and are never highlighted in red, correct?
  - Default: correct.

---

## TODO-105 — Feature

**It asks:** Add a search box that filters tasks by title and works together with the status filter.

**Ambiguous:**
- Should Vietnamese diacritics be ignored when matching? (does "mua sua" match "Mua sữa"?)
- Should the keyword be trimmed?
- Is search done on the client or through an API? (the ticket does not say; check whether the current app has a backend)

**First step:** Choose reasonable defaults yourself (case-insensitive, substring match, trim) and record the assumptions in the PR. Look at the current list component to add the search filter next to the status filter.

**Why:** Debounce is a technical decision for the dev, not a question for the BA. Cross-ticket note: search adds another filter layer on the list, which is exactly the condition that causes the TODO-103 bug. Make sure deletion works by `id` (the fix for 103) before or together with this.

**Questions for BA/QA:**
- **Q1 (BA):** Should search ignore Vietnamese diacritics? For example, does typing "mua sua" match "Mua sữa"?
  - Context: the AC only covers case-insensitivity and substring matching ("mil" matches "Buy milk").
  - Default: ignore diacritics.
- **Q2 (BA):** Should the keyword be trimmed of leading/trailing spaces?
  - Default: yes, trim.
- **Q3 (BA):** What is the expected maximum number of tasks per user?
  - Context: decides whether to search on the client or call the server.
  - Default: a few hundred tasks, search on the client.
- *Not asked:* debounce, because it is a technical decision for the dev.
