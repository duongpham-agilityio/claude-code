---
name: create-branch
description: Create a correctly named git branch based on the current uncommitted changes. Use this whenever the user asks to create a branch, open a new branch, move the current changes onto a branch, or says "tạo branch", "tạo nhánh", "đặt tên branch", "tôi lỡ code trên main", even if they do not give a branch name.
---

# Create branch from current changes

Read the changes, derive the branch name from them, then switch to the new branch with the changes carried over. This skill is self-contained: it does not depend on any project's CLAUDE.md, so it works in any repo.

Branch name format: `<type>/<short-kebab-description>`, with type one of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`. Work should never be committed directly on `main`, which is why changes made there get moved onto a new branch.

This skill only creates and switches the branch. It never commits, pushes, stashes or opens a PR, because the user decides when to do those.

## 1. Inspect
Run `git branch --show-current`, `git status --short` and `git diff HEAD --stat`. Untracked files only show in `status`, so read both.
- No changes at all: **STOP**. Say there is nothing to name a branch after and ask what the branch is for. If the user already gave a name or purpose, create the branch from it and skip to step 4.
- Need more than filenames to judge intent: read `git diff HEAD` for the relevant files.

## 2. Pick the type
Choose the prefix from what the changes do, not from file count:
- `feat`: new behaviour or capability for users
- `fix`: corrects wrong behaviour
- `refactor`: restructures code without changing behaviour
- `docs`: only docs or markdown (including `docs/plans/`)
- `test`: only test files
- `chore`: tooling, config, dependencies, `.claude/`, scripts

When changes mix types, use the one that carries the main intent. If they are truly unrelated (for example a feature plus an unrelated config tweak), say so and suggest splitting into separate branches. **STOP** and let the user choose, since one branch should hold one logical change.

If the user states a type or purpose, that wins over your inference.

## 3. Pick the description
- English, lowercase kebab-case, 2 to 5 words, naming what changes (`login-form-validation`, not `update-stuff`).
- Reuse the ticket name when the user gave one or `docs/plans/<ticket-name>.md` matches the changes.
- No dates, no usernames, no trailing hyphens.

## 4. Check the starting point
Run `git branch --list '<name>'` for a collision.
- Branch exists: **STOP**, show it and ask whether to switch to it, or use a different name. Never overwrite it.
- Current branch is not `main` and already has the same purpose: the changes belong here, so say that and do nothing.
- Current branch is not `main` and has a different purpose: **STOP** and ask whether to branch from here or from `main`, because the new branch would inherit this branch's commits.
- On `main`: continue. This is the normal case.

## 5. Create
Run `git switch -c <type>/<description>`. This keeps uncommitted changes in the working tree and moves HEAD, so nothing is lost. If git refuses because of a conflict, report the shortest decisive error line and stop; do not stash or reset to force it.

## 6. Report
Give the final branch name, the type and why you chose it, and the starting point. Mention that nothing was committed or pushed, and that `git branch -m <new-name>` renames it if the name is off.
