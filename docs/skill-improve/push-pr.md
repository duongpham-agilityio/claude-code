# Skill improvements: `push-pr`

Skill: `.claude/skills/push-pr/`

Backlog of improvements for this skill. One entry per item, newest at the bottom.

## How to use this file

- Add a new entry using the template below, with the next ID (`PP-001`, `PP-002`, ...). Never reuse or renumber IDs.
- One entry per improvement. If a change has two independent parts, write two entries.
- Update `Status` in place. Do not delete finished entries.
- Statuses: `open`, `in-progress`, `done`, `wontfix`.

## Index

| ID | Title | Status |
|----|-------|--------|
| PP-001 | Create the PR against the parent branch | open |

## Entry template

```markdown
## PP-NNN: <short title>

- Status: open
- Found: <YYYY-MM-DD>

### Problem
<what is wrong today>

### Expected
<what the skill should do instead>
```

---

## PP-001: Create the PR against the parent branch

- Status: open
- Found: 2026-10-26

### Problem
The PR is created against the repo's default branch (`main`). For example, `feat/todo-app-structure` was created from `develop`, but the PR was opened against `main`.

### Expected
The PR targets the parent branch: the branch the current branch was created from (here `develop`), not the default branch.
