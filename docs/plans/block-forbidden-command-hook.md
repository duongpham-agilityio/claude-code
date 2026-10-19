# block-forbidden-command hook

## Goal
Day 09 dev task 1: ship one hook via PR. A project-level `PreToolUse` hook that blocks Claude from running `git push` to `main`, so the "never push to main" rule is enforced automatically.

## Steps
1. Write failing tests in `.claude/hooks/block-forbidden-command.test.mjs`: push to main is blocked; feature-branch push, other git commands, non-Bash tools and malformed input are allowed.
2. Implement `.claude/hooks/block-forbidden-command.mjs`: exported pure `check(input)` matching `/\bgit\s+push\b.*\bmain\b/` on Bash commands; the CLI part reads stdin JSON, exits 2 with the reason on stderr when blocked, fails open on malformed input.
3. Register in `.claude/settings.json`: `PreToolUse`, matcher `Bash`, command `node "$CLAUDE_PROJECT_DIR/.claude/hooks/block-forbidden-command.mjs"`.

## Files to change
- `.claude/settings.json` (new)
- `.claude/hooks/block-forbidden-command.mjs` (new)
- `.claude/hooks/block-forbidden-command.test.mjs` (new)
- `docs/plans/block-forbidden-command-hook.md` (new)

## How to verify
- `pnpm test`, `pnpm lint`, `pnpm build` pass.
- Pipe sample hook JSON into the script: push to main exits 2, push to a feature branch exits 0.
- Fresh session: ask Claude to push to main and see it blocked.

## Known limits
- A bare `git push` with no branch name is not checked (no branch lookup, kept simple).
- Hook only affects Claude's tool calls, not commands typed by the user.
