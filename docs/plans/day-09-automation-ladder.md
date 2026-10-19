# Day 09 dev 2: automation ladder

## Goal
Climb three rungs of the automation ladder on the training repo: `/goal` on a bounded task, a local scheduled task that cleans up merged branches, and `@claude` GitHub Actions review on PRs. Routines (cloud) is skipped for now.

## Steps
1. **`@claude` GitHub Actions** (user-run, secrets stay with the user)
   - User runs `/install-github-app` in this repo and follows the prompts; it opens a PR that adds the workflow file(s) under `.github/workflows/`. Claude never reads or enters tokens/API keys.
   - After merge, the next PR triggers `@claude` review. Claude then helps evaluate its comments (correct, useful, noise) for the day-09 exercise.
2. **Desktop scheduled task: delete merged branches**
   - Create a Local routine (Code tab, Routines, New routine, Local) in this repo.
   - Task prompt: `git fetch github --prune`; list branches merged into `main` (`git branch --merged main`, `git branch -r --merged github/main`); skip `main`, the current branch, and anything not merged; delete local with `git branch -d` (safe delete, refuses unmerged); delete remote with `git push github --delete <branch>` for `github` only (never `origin`/GitLab); print what was deleted.
   - Default schedule: weekly, Friday 17:00 (confirm before creating).
   - Risk: remote deletion is irreversible and may hit permission prompts when unattended, so the first run is a dry run that only lists candidates.
3. **`/goal` on a bounded task** (user types `/goal`)
   - Candidate condition: "`pnpm test`, `pnpm lint` and `pnpm build` all pass and a new test covers X". The concrete small task is picked from `src/` before running; confirm with user first.

## Files to change
- `.github/workflows/*` (new, created by `/install-github-app`, not hand-written)
- `docs/plans/day-09-automation-ladder.md` (new)
- Scheduled task lives in the Desktop app, not in the repo.

## How to verify
- `@claude` review: open a small PR, comment appears from `@claude`; evaluate it.
- Scheduled task: dry run lists only already-merged branches (expect `feat/release-checklist-skill`-style branches on `github`, none unmerged); then a real run deletes them locally and on `github`.
- `/goal`: stops when the stated condition is met; `pnpm test`, `pnpm lint`, `pnpm build` pass.

## Open questions
- Schedule time/frequency for the cleanup task.
- Which small task to use for `/goal`.
- `/install-github-app` needs auth (OAuth/API key) that only the user can provide.
