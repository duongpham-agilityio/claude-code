# ai-tool-training

A practice project for applying what I have learned with **Claude Code**. The exercise: build a simple **todo list** app.

The goal is not a complex app, but practicing the Claude Code workflow: skills, subagents, hooks, MCP, and plan → code → test → commit → PR.

## Tech stack

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript 6 |
| Build tool | Vite 8 (`@vitejs/plugin-react`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| State | Zustand 5 |
| Testing | Vitest 5, Testing Library (react, dom, jest-dom, user-event), jsdom |
| Component docs | Storybook 10 (addons: vitest, a11y, docs, mcp) |
| Browser testing | `@vitest/browser-playwright`, Playwright |
| Coverage | `@vitest/coverage-v8` |
| Lint | oxlint |
| Package manager | pnpm |

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server (Vite) |
| `pnpm build` | Type-check (`tsc -b`), then build for production |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Lint with oxlint |
| `pnpm test` | Run unit tests (`vitest run --project unit`) |
| `pnpm storybook` | Start Storybook on port 6006 |
| `pnpm build-storybook` | Build a static Storybook |

## Project structure

```
.
├── src/
│   ├── components/
│   │   ├── shared/      # Shared components (Button, ...)
│   │   └── todo/        # Todo-specific components (TodoItem, ...)
│   ├── hooks/todo/      # Custom hooks (use-todo-list)
│   ├── stores/todo/     # Zustand store
│   ├── types/todo/      # Type definitions
│   ├── constants/       # Constants
│   ├── pages/           # Pages (HomePage)
│   ├── App.tsx
│   └── main.tsx
├── .storybook/          # Storybook config
├── .claude/             # Claude Code config
│   ├── agents/          # Subagents (analyze-ticket, bug-report, notion-lesson-summarizer)
│   ├── skills/          # Skills (commit, create-branch, push-pr, ticket-analysis, ticket-plan, ...)
│   ├── hooks/           # Hooks (block forbidden commands, verify before commit)
│   └── settings.json
├── docs/                # Docs produced during practice
│   ├── plan-per-day/    # Daily plans
│   ├── exercises/       # Exercises
│   ├── learning-summaries/
│   ├── plans/           # Implementation plans per ticket
│   ├── bug-reports/
│   ├── code-review/
│   └── skill-improve/
├── utils/               # Plain JS helper scripts
├── .mcp.json            # MCP servers (Notion, Playwright)
└── vite.config.ts
```

Conventions:

- Each feature has its own folder under `components/`, `hooks/`, `stores/`, and `types/` (currently `todo`).
- Test files sit next to the code (components) or in `__test__/` (hooks, stores).
- Each component ships with a `*.stories.tsx` file.
- Cross-directory imports use the `@` alias, which points to `src`.

## Claude Code setup

- **Skills**: `commit`, `create-branch`, `push-pr`, `ticket-analysis`, `ticket-plan`, `bug-repro-report`, `release-checklist`.
- **Subagents**: `analyze-ticket-agent`, `bug-report-agent`, `notion-lesson-summarizer`.
- **Hooks**: block dangerous commands, run verification before commit.
- **MCP**: Notion, Playwright.

## Git workflow

- Main branch: `main`; working branch: `develop`.
- Commits follow Conventional Commits.
- Each change goes on its own branch, then a PR into `develop`.
