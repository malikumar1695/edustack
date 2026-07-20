# Ilm — build log

Running notes for the 1hr/day sessions. Update at the end of every session: what shipped, what's next.

## Week 1 — Live skeleton + auth

- [x] **S1 (Mon)** — Next.js 14 + TS + Tailwind scaffold, `npm run build` verified clean, git initialized.
- [x] **S1b** — Added Ant Design for the `/dashboard` route only (via `@ant-design/nextjs-registry` for App Router SSR), public `/` stays pure Tailwind. Decision: Tailwind closes the JD2 gap on public/marketing pages; Ant Design reinforces the CV strength on the data-heavy authenticated dashboards — a deliberate split, not a random mix. Verified via `npm run build`: `/` is 5.35 kB, `/dashboard` carries its own 107 kB antd bundle, no SSR/hydration errors.
      Next: push to GitHub, connect Vercel for auto-deploy on push.
- [ ] **S2 (Wed)** — Postgres (Neon free tier) + Prisma schema: users/roles/students/classes/enrollments, seed script.
- [ ] **S3 (Fri)** — Auth (NextAuth or hand-rolled JWT) with role field + RBAC middleware; login page redirects by role.

**Done when:** live Vercel URL exists, four role logins land on four distinct dashboards.
