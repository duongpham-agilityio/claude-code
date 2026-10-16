# Claude Code in action

> Source: https://app.notion.com/p/3fbd081bb4ac81d2a168f02eecf3ec77

## Module: Module 2: Configure Claude

### Lesson 2: A `CLAUDE.md` that follows

- `CLAUDE.md` is guidance, not enforced configuration; the longer the file, the less each rule is followed.
- Hard rules like "never push to main" belong in a pre-tool-use hook; only soft conventions belong in `CLAUDE.md`.
- `CLAUDE.md` loads from 4 locations at once: managed policy, user, project, local; they stack on top of each other.
- Imports help organize the file but do not reduce context, because everything is still loaded up front.
- Rules should be specific, checkable and name the replacement; spend emphasis on only 2-3 rules; revise the file whenever Claude gets something wrong.

### Lesson 3: Verification skills

- A verification skill fires automatically when a change matches its description, so checking no longer depends on you remembering.
- The skill runs the tests, reads the diff, checks that no test was loosened to pass, then reports pass/fail with evidence.
- Done means the gates were run and observed, not that the code looks fine.
- A skill folder can hold a `reference.md` (read on demand) and executable scripts; keep `skill.md` lean.
- Always-on conventions go in `CLAUDE.md`, per-task procedures go in skills, rules that must never be skipped go in hooks.

### Lesson 4: Permission modes

- Permission modes let you decide once what Claude may run without asking on every action.
- Shift+Tab cycles through the 3 hands-on modes: manual, accept edits and plan.
- The hands-off group is the remaining modes, and the recommended one is `auto`.
- Pick the mode based on the type of work and your level of trust.

### Lesson 5: Hooks

- A rule in `CLAUDE.md` is only a request; a hook is deterministic code, so it guarantees Claude cannot skip it.
- PreToolUse blocks an action before it happens; PostToolUse auto-formats; Stop refuses to end the turn when work is not done.
- PreToolUse returns JSON with `permissionDecision` (allow, deny, ask, defer); `updatedInput` rewrites the call and must echo unchanged fields.
- Only exit 2 blocks and feeds stderr back to Claude; exit 1 does not block, Claude keeps going.
- To re-inject context after a compact, use SessionStart with the `compact` matcher, not PostCompact.

## Module: Module 3: Automate repeat work

### Lesson 6: Routines and headless

- A routine is prompt + repo + connectors running in the cloud, triggered by cron, HTTP POST or a GitHub event.
- Routines run at most once per hour, start from a fresh clone, and can only push to branches prefixed `claude/`.
- Headless mode `claude -p` runs one-shot and is pipeable, but skips auto-discovery of hooks, skills and `CLAUDE.md`.
- `--json-schema` with `--output-format json` gives `structured_output`; `session_id` enables resume; `--bare` makes CI runs repeatable.
- The Agent SDK embeds Claude Code in your app; start with routines and move down the spectrum only when you need more control.

### Lesson 7: GitHub Actions and Code Review

> The Notion page has no notes for this lesson yet. The points below are inferred from Lessons 3, 5 and 6, not from the notes.

- Routines can be triggered by a GitHub event, e.g. a PR triager that fires on a new pull request.
- Automated review should include a verify step that runs tests and reads the diff, like a verification skill.
- Automated runs only push to branches prefixed `claude/`, so they cannot overwrite `main`.

## Module: Module 4: Verify and share

### Lesson 8: Trust it: Verifying unsupervised runs

> The Notion page has no notes for this lesson yet. The points below are inferred from Lessons 3, 5 and 6, not from the notes.

- For unsupervised runs, "usually follows" is not enough; hooks are needed to guarantee behavior.
- A Stop hook can refuse to end the turn when conditions are not met.
- Done requires gates that were run and observed, with pass/fail backed by evidence.

### Lesson 9: Plugins

- A plugin is one installable unit bundling skills, subagents, hooks and MCP server configs so a whole team can share a setup.
- A private marketplace is added once with `/plugin marketplace add`, giving centralized discovery, version tracking and updates.
- Plugins run code with your permissions; reviewed does not mean trusted, so read the hooks, agents and MCP servers before installing.
- Plugin components run alongside your config: hooks stack, skills are namespaced, and `settings.json` honors only 2 keys.
- Packaging keeps the `.claude` structure as is; the `plugin.json` manifest is optional, only `name` is required, and `version` tracks updates.
