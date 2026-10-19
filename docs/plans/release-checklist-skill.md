# release-checklist skill

## Goal
Team skill so every release follows the same process: verify first, only then touch version and tag. Claude never skips a step and never pushes or tags without being asked.

## Steps
1. Create `.claude/skills/release-checklist/SKILL.md` with frontmatter (`name`, trigger-oriented `description`).
2. Body covers: pre-flight (clean tree, not on `main`), quality gates (`pnpm test`, `pnpm lint`, `pnpm build`), version proposal from Conventional Commits, release notes from `git log`, version bump commit, tag preparation, final report.
   Release notes use one fixed template (Highlights, Features, Fixes, Refactors, Docs and chores, Breaking changes) embedded in the skill, so every release reads the same.
3. Stop points: failing gate, version confirmation, commit, tag/push. Each needs an explicit user go-ahead.
4. Refer to CLAUDE.md for commit and branch rules instead of duplicating them.

## Files to change
- `.claude/skills/release-checklist/SKILL.md` (new)
- `docs/plans/release-checklist-skill.md` (new)

## How to verify
- Dry-run three scenarios by following the skill: green branch stops at version confirmation and tag; failing test stops at the gate without editing the test; being on `main` refuses and asks for a branch.
- `pnpm test`, `pnpm lint`, `pnpm build` still pass.
- Fresh session: "prepare a release" triggers the skill.
