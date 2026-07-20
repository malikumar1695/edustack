# Ilm — build log

Running notes for the 1hr/day sessions. Update at the end of every session: what shipped, what's next.

## Week 1 — Live skeleton + auth

- [x] **S1 (Mon)** — Next.js 14 + TS + Tailwind scaffold, `npm run build` verified clean, git initialized.
      Next: push to GitHub, connect Vercel for auto-deploy on push.
- [ ] **S2 (Wed)** — Postgres (Neon free tier) + Prisma schema: users/roles/students/classes/enrollments, seed script.
- [ ] **S3 (Fri)** — Auth (NextAuth or hand-rolled JWT) with role field + RBAC middleware; login page redirects by role.

**Done when:** live Vercel URL exists, four role logins land on four distinct dashboards.
