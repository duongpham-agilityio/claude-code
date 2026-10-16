# Project
Repo for learning to work with Claude Code on a real project: from receiving a ticket (feature, bug) to delivery.

# Architecture
- Single-page React 19 + TypeScript + Vite app, no router yet, state uses React built-ins
- Code is organized by feature: `src/features/<feature>/` (component, hook, logic, test); shared code goes in `src/shared/`; a feature must not import another feature
- `src/todo/` is an exception, not yet following the features structure (not migrated yet)

# Commands
Use `pnpm` only, never npm / yarn.
- `pnpm dev` — run locally
- `pnpm build` — `tsc -b && vite build`
- `pnpm lint` — oxlint
- `pnpm test` — vitest run (single run, no watch); single file: `pnpm test src/todo/todo.test.ts`

# Workflow (per ticket)
1. Read the ticket
2. Clarify: list ambiguities + questions for the user to send to the ticket author. Stop and wait for answers, do not guess. If the ticket has no ambiguity, state that explicitly and move on to the Plan step without stopping
3. Plan: make sure you are on the correct branch (see Git Rules), then create a short file in `docs/plans/<ticket-name>.md` (goal, steps, files to change, how to verify). Wait for user approval before coding
4. Test: write a failing test first (TDD for bugs/features)
5. Code: write code to make the test pass
6. Verify: run `pnpm test`, `pnpm lint` and `pnpm build` before reporting done (type errors only surface at build)
7. Commit / push / PR: follow Git Rules

# Conventions
- Naming: files/folders kebab-case (e.g. `pluralize-utility.ts`); exception: components use a PascalCase folder with file `PascalCase/index.tsx`; styles use CSS Modules `PascalCase/index.module.css`
- Components, functions, hooks always use arrow functions; use short-return when there is no logic inside
- Tests live next to the file: `todo.ts` → `todo.test.ts`; components `PascalCase/index.test.tsx`
- Pure logic does not import React
- Logic functions throw `Error` with a clear message and never swallow errors. Only the UI layer / entry points try-catch and show errors to the user

# Hard constraints
- Do not read, print or commit `.env*` files; ask first before any action that needs a secret
- Do not edit tests to make them pass; if a test fails, fix the code. If you believe the test is wrong against the ticket requirements, stop and ask the user
- Do not add new dependencies (including router, state/data libraries) without asking
- Do not edit `docs/exercises/` (including ticket files)

# Language
- Chat with user: Vietnamese
- Code, comments, commits, `docs/plans/`: English

# Git Rules
## Commits
- Format: Conventional Commits — `type(scope): subject`
  - Types: feat, fix, refactor, docs, chore, test
  - Subject: lowercase, no trailing period
- Subject line only — no commit body
- Never add `Co-Authored-By` or any attribution trailer
- One logical change per commit; split unrelated changes into separate commits
- Commit only when the user asks. Never push or open a PR on your own

## Branches
- Never commit directly to `main`
- If on `main`, create a branch following the naming rule below before starting to code
- Branch name: `<type>/<short-kebab-description>` (e.g. `feat/claude-md-lesson`)
- Allowed prefixes: feat/, fix/, refactor/, docs/, chore/, test/
