# Skill improvements: `ticket-analysis`

Skill: `.claude/skills/ticket-analysis/`

Backlog of improvements for this skill. One entry per item, newest at the bottom.

## How to use this file

- Add a new entry using the template below, with the next ID (`TA-001`, `TA-002`, ...). Never reuse or renumber IDs.
- One entry per improvement. If a change has two independent parts, write two entries.
- Update `Status` in place. Do not delete finished entries.
- Statuses: `open`, `in-progress`, `done`, `wontfix`.

## Index

| ID | Title | Status |
|----|-------|--------|
| TA-001 | Read the ticket from a reference instead of requiring pasted text | done |
| TA-002 | Resolve the task-management tool from CLAUDE.md and live MCP before reading the ticket | done |
| TA-003 | Fall back to CLI, then ask where tickets are managed | done |

## Entry template

```markdown
## TA-NNN: <short title>

- Status: done
- Found: <YYYY-MM-DD>

### Problem
<what is wrong today>

### Expected
<what the skill should do instead>
```

---

## TA-001: Read the ticket from a reference instead of requiring pasted text

- Status: done
- Found: 2026-10-27

### Problem
The skill assumes the ticket content is already in context and says "Do not fetch it". The user has to paste the ticket text into the prompt first.

A short reference does not work. Running `/ticket-analysis ticket #49` or `/ticket-analysis github ticket #49` makes the skill answer that it has no context for that ticket. It only reads the ticket after the user explicitly tells it to use the CLI.

### Expected
The skill accepts a ticket reference as its argument (for example `ticket #49`, `github ticket #49`, `PROJ-123`, or a ticket URL) and fetches the ticket itself. The user does not paste the text or name the CLI.

A ticket whose text is already pasted into the prompt still works as before and is not fetched again.

The "Do not fetch it" rule and the "If the ticket is not in context, say so and end" rule are replaced by this flow. The skill still only reads the ticket: it never edits or comments on it.

## TA-002: Resolve the task-management tool from CLAUDE.md and live MCP before reading the ticket

- Status: done
- Found: 2026-10-27

### Problem
The skill does not know which task-management system the project uses (GitHub Issues, GitLab Issues, Jira, ...). Today it deliberately avoids picking or checking any ticket tool, CLI or MCP server, so it has no way to turn `#49` into a real ticket.

The project does not say where tickets live either. This repo has two remotes (`github` and `origin` on GitLab), so the git remote alone cannot tell the skill which one holds the tickets.

### Expected
The project declares its management tools in a "Management tools" section of `CLAUDE.md`, one row per category (for example Tasks, Log tracing) with the tool, how to access it (MCP) and a fallback (CLI):

```markdown
## Management tools

| Category | Tool | Access | Fallback |
|----------|------|--------|----------|
| Tasks | GitHub Issues (remote `github`) | MCP GitHub | `gh issue view <number>` |
| Log tracing | Sentry (project `<name>`) | MCP Sentry | ask the user for the issue link |
```

Rules for that section:
- Only stable facts: category, tool, access, fallback. No connection state, and no token, DSN or key.
- Only categories a skill actually reads. Other skills (for example `bug-repro-report` reading log tracing) can reuse the same section.
- Writing the section into `CLAUDE.md` is a follow-up done after this entry; it is not part of the skill change.

Before reading the ticket, the skill picks the source in this order:
1. The reference names a source (`github ticket #49`): use that source.
2. Otherwise, use the "Tasks" row in `CLAUDE.md`.
3. Then check live whether the MCP server for that tool is connected. If it is, use it to read the ticket. The declaration is never trusted for connection state.

The reply states which tool was used.

## TA-003: Fall back to CLI, then ask where tickets are managed

- Status: done
- Found: 2026-10-27

### Problem
When the task-management MCP is not connected, or the project declares nothing, the skill has nothing to fall back on. It either stops with "no context" or guesses. Reading the ticket through the CLI (`gh`) did work once the user asked for it, but the skill never tries it on its own.

### Expected
When the flow in TA-002 does not give a usable MCP, the skill goes on in this order:
1. Use the fallback CLI from the `CLAUDE.md` row (for example `gh issue view <number>`), or the CLI that matches the source named in the reference (`gh` for GitHub, `glab` for GitLab).
2. If the project declares nothing and no CLI fits, ask the user one short question: where is the ticket managed (GitHub Issues, GitLab Issues, Jira, other)? Then continue with the answer, or end with a short note if the user cannot provide the ticket.

This is the one place where the skill asks the user something, so the current rule "this skill never asks the user anything" is relaxed to allow it. Asking the reporter for clarification stays out of scope: those questions still go into the doc only.
