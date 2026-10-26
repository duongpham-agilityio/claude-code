# Skill improvements: `create-branch`

Skill: `.claude/skills/create-branch/`

Backlog of improvements for this skill. One entry per item, newest at the bottom.

## How to use this file

- Add a new entry using the template below, with the next ID (`CB-001`, `CB-002`, ...). Never reuse or renumber IDs.
- One entry per improvement. If a change has two independent parts, write two entries.
- Update `Status` in place. Do not delete finished entries.
- Statuses: `open`, `in-progress`, `done`, `wontfix`.

## Index

| ID | Title | Status |
|----|-------|--------|
| CB-001 | Branch from the current branch and report where it came from | open |

## Entry template

```markdown
## CB-NNN: <short title>

- Status: open
- Found: <YYYY-MM-DD>

### Problem
<what is wrong today>

### Expected
<what the skill should do instead>
```

---

## CB-001: Branch from the current branch and report where it came from

- Status: open
- Found: 2026-10-26

### Problem
Step 4 of the skill cares about which branch the user is standing on. When the current branch is not `main`, it stops and asks whether to branch from here or from `main`. For example, on `develop` it asked "branch from develop or main?" even though the user just wants a branch for the current changes.

### Expected
The skill does not care who the parent branch is. It only derives the name from the current changes and runs `git switch -c <type>/<description>` from the branch the user is standing on, with no question about the base.

After creating the branch, the report states where it was checked out from (for example: "Created `chore/verify-before-commit-hook` from `develop`").

If the user wants a different base, they ask for it afterwards and the skill handles it as a separate update request.
