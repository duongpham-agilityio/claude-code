# Code review: feat/login-form (initial)

Target: PR #10 (`feat(login): add login form with email validation`), level `high`.
Result: 8 findings. All 8 were applied.

| # | Category | Location | Finding | Outcome |
|---|----------|----------|---------|---------|
| 1 | correctness | `src/App.tsx:15` | Password is collected but never validated; any value (even empty) logs in | fixed |
| 2 | altitude | `src/App.tsx:3` | Credential check is hard-coded in the client bundle (`VALID_EMAIL`) | fixed (marked as placeholder) |
| 3 | correctness | `src/App.tsx:16` | Email comparison is case-sensitive; only whitespace is normalized | fixed |
| 4 | correctness | `src/App.tsx:29` | `type="email"` native validation blocks submit for malformed input, so "Invalid email" never shows | fixed (`noValidate`) |
| 5 | conventions | `src/App.tsx:1` | Login UI and validation live in `src/App.tsx`, not `src/features/login/`; validation is not a pure function | fixed |
| 6 | test-coverage | `src/App.test.tsx:9` | No tests for empty email, malformed email, or error clearing after failure then success | fixed |
| 7 | altitude | `.mcp.json:8` | Playwright MCP launched via unpinned `@playwright/mcp@latest` | fixed (pinned `0.0.83`) |
| 8 | simplification | `src/App.tsx:7` | `password` state is controlled but its value is never read | fixed |

## Details

1. **Password never validated.** `admin@test.com` with an empty or arbitrary password shows "welcome to my app". The existing test passes `'anything'`, which locks the behavior in.
2. **Hard-coded credential.** The shipped JS contains `admin@test.com`. Acceptable for a training stub, but nothing marked it as a placeholder.
3. **Case-sensitive email.** `Admin@Test.com` shows "Invalid email"; `trim()` suggested normalization was intended but incomplete.
4. **Native validation hides custom error.** Typing `abc` triggers the browser tooltip and `onSubmit` never runs, so the `role="alert"` error is not shown. Tests only covered well-formed emails.
5. **Convention violation.** Breaks `CLAUDE.md`: "Code is organized by feature: `src/features/<feature>/`", "components use a PascalCase folder with file `PascalCase/index.tsx`", "Pure logic does not import React".
6. **Coverage gaps.** Regressions in `setError('')`, empty-field handling, or case handling would not be caught.
7. **Unpinned MCP package.** Each session runs whatever `latest` resolves to with local privileges; not reproducible.
8. **Unused controlled state.** `useState` + `onChange` re-render on every keystroke for a value nobody reads.
