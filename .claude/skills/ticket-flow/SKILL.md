---
name: ticket-flow
argument-hint: "<ticket-id | description>"
description: Run a ticket from start to a pull request in one go - isolated worktree, branch, analysis (or bug report), plan, implementation, commit, push and PR. Chains the existing ticket-analysis, bug-repro-report, ticket-plan, ticket-implement, commit and push-pr skills. Use this whenever the user wants a ticket done end to end, or says "ticket flow", "làm ticket từ đầu đến cuối", "chạy cả workflow", "từ ticket ra PR", "làm ticket 42 rồi tạo PR", even if they only give a ticket id or a one-line description.
---

# Ticket flow

Thin orchestrator. Each stage is an existing skill, called with the Skill tool in order; their rules are not repeated here. Chat output is Vietnamese, files and code are English. There are no approval stops: the flow runs to the PR and stops only when a stage reports `STOP` or a failure.

Typing `/ticket-flow` is the user's explicit request to commit, push and open a PR, so those stages run even though the global rule says to skip git steps found inside skills.

## 1. Ticket
Get the ticket the way the "Management tools" table in `CLAUDE.md` says, and keep its text, title and labels in context so the later skills fetch nothing again.
- Free-text description instead of an id: use it as the ticket. `<id>` is a kebab-case slug of 2 to 5 words, and there is no issue to close.
- Neither an id nor a description: ask for one in a short Vietnamese line and stop.

`<id>` below means the number without `#`, or that slug.

## 2. Worktree
Run `BASE=$(git branch --show-current)`. Detached HEAD: stop. `BASE` is the PR target; it is never asked.
- Branch name `<type>/<slug>`: same format as `create-branch` (type list, 2 to 5 word kebab-case). Type from the ticket: `bug` label → `fix`, otherwise `feat`, or the type the labels or text clearly name.
- If `.claude/worktrees/<slug>` or the branch already exists: do not touch it. List what exists (worktree, `docs/analysis|bug-reports|plans/ticket-<id>-*`), ask in one Vietnamese line which stage to resume from, and stop.
- Otherwise: `git worktree add -b <branch> .claude/worktrees/<slug> "$BASE"`, then `git config branch.<branch>.parent "$BASE"`, then `EnterWorktree` with `path` set to that folder, then `pnpm install`. Every later stage runs inside the worktree.

## 3. Analyse
- Label `bug`: `bug-repro-report`. Any other clear type: `ticket-analysis`.
- No label or type signal (always the case for a free-text description unless it says so): ask one Vietnamese line, bug or not, and stop.

Pending clarifying questions do not stop the flow; `ticket-plan` uses the stated default assumptions.

## 4. Plan and implement
1. `ticket-plan <id>`
2. `ticket-implement <id>`

If the implement report shows a Step not done, or a Done check that failed or was not run: stop, report it, do not commit.

## 5. Commit
`commit auto`, once, after implement. It splits docs from code itself. A hook runs lint, test and build first; if it blocks, stop and report its line.

## 6. Push and PR
Before calling `push-pr`, write these into the conversation so its description picks them up:
- The real issue id as `Closes #<id>`. Skip this for a slug id.
- Every unconfirmed assumption from the plan, under Why, so a reviewer sees what was guessed.
- Screenshots: if the UI changed, write `N/A - screenshots not attached`. Do not ask the user for images; that would stop the flow.

Then `push-pr auto "$BASE" remote=github`. A base argument and a remote are required: the worktree branch has no usable reflog parent, and the repo has two remotes.

## 7. Report
Short Vietnamese: branch, worktree path, doc paths, commits, PR URL, assumptions used, deviations from `ticket-implement`. Always add:
- The worktree is kept; remove it yourself when the PR is merged.
- If `BASE` is `main`, the PR targets `main`, while `CLAUDE.md` says PRs go to `develop`.

## Known limits
- Two sessions running UI previews at once clash on ports 5173 and 6006 (`.claude/launch.json`).
- Hooks and previews are only correct if they follow the session into the worktree. If lint, test or preview output looks like it ran against the main checkout, say so in the report.
