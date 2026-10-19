Maintenance pass for the current branch's open PR. Follow CLAUDE.md.

1. Check PR state with `gh pr view` and `gh pr checks`: review comments, failing CI, merge conflicts.
2. Run `pnpm test`, `pnpm lint` and `pnpm build`.
3. Report only failures or new review comments. If everything passes and nothing is new, say "all green" in one line.

Rules:
- Read-only. Do not edit files, commit, push, merge, or change the PR.
- Do not read or print `.env*` files.
- Chat replies in Vietnamese.
