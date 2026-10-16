# Project
Repo học làm việc với Claude Code trong dự án thực: từ nhận ticket (feature, bug) đến deliver.

# Architecture
- Single-page React 19 + TypeScript + Vite app, chưa có router, state dùng React built-in
- Code theo feature: `src/features/<feature>/` (component, hook, logic, test); dùng chung đặt ở `src/shared/`; feature không import feature khác
- `src/todo/` là ngoại lệ, chưa theo cấu trúc features (chưa chuyển)

# Commands
Chỉ dùng `pnpm`, không dùng npm / yarn.
- `pnpm dev` — chạy local
- `pnpm build` — `tsc -b && vite build`
- `pnpm lint` — oxlint
- `pnpm test` — vitest run (chạy một lần, không watch); một file: `pnpm test src/todo/todo.test.ts`

# Workflow (mỗi ticket)
1. Đọc ticket
2. Clarify: liệt kê chỗ mơ hồ + câu hỏi để user gửi người tạo ticket. Dừng chờ trả lời, không tự đoán. Nếu ticket không có chỗ mơ hồ, nêu rõ điều đó rồi chuyển sang bước Plan, không cần dừng
3. Plan: đảm bảo đang ở đúng branch (xem Git Rules), rồi tạo một file ngắn trong `docs/plans/<ten-ticket>.md` (mục tiêu, các bước, file sửa, cách verify). Chờ user duyệt trước khi code
4. Test: viết test fail trước (TDD cho bug/feature)
5. Code: viết code cho test pass
6. Verify: chạy `pnpm test`, `pnpm lint` và `pnpm build` trước khi báo xong (lỗi type chỉ lộ ra khi build)
7. Commit / push / PR: theo Git Rules

# Conventions
- Đặt tên: file/folder kebab-case (vd `pluralize-utility.ts`); ngoại lệ component dùng thư mục PascalCase, file `PascalCase/index.tsx`; style bằng CSS Modules `PascalCase/index.module.css`
- Component, function, hook luôn dùng arrow function; không có logic bên trong thì dùng short-return
- Test đặt cạnh file: `todo.ts` → `todo.test.ts`; component `PascalCase/index.test.tsx`
- Logic thuần không import React
- Hàm logic throw `Error` với message rõ ràng, không nuốt lỗi. Chỉ tầng UI / điểm vào mới try-catch và hiển thị lỗi cho user

# Hard constraints
- Không đọc, in ra hoặc commit file `.env*`; action nào cần secret phải hỏi trước
- Không sửa test cho pass; test fail thì sửa code. Nếu cho rằng test sai so với yêu cầu ticket, dừng lại và hỏi user
- Không thêm dependency mới (gồm router, thư viện state/data) khi chưa hỏi
- Không sửa `docs/exercises/` (gồm các file ticket)

# Language
- Chat với user: tiếng Việt
- Code, comment, commit, `docs/plans/`: tiếng Anh

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
