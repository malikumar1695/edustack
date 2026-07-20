# Ilm — build log

Running notes for the 1hr/day sessions. Update at the end of every session: what shipped, what's next.

## Week 1 — Live skeleton + auth

- [x] **S1 (Mon)** — Next.js 14 + TS + Tailwind scaffold, `npm run build` verified clean, git initialized.
- [x] **S1b** — Added Ant Design for the `/dashboard` route only (via `@ant-design/nextjs-registry` for App Router SSR), public `/` stays pure Tailwind. Decision: Tailwind closes the JD2 gap on public/marketing pages; Ant Design reinforces the CV strength on the data-heavy authenticated dashboards — a deliberate split, not a random mix. Verified via `npm run build`: `/` is 5.35 kB, `/dashboard` carries its own 107 kB antd bundle, no SSR/hydration errors.
- [x] **S1c** — Restructured into `apps/web` (Next.js) + `apps/api` (Express + TS). Decision: Node/Express is the strongest, most-proven skill on the CV (6 yrs, backbone of every listed project) — a real API boundary between frontend and backend is a more realistic senior-level architecture than Next.js route handlers doing everything, and gives a clean "why did you separate these" interview answer (independent deploy targets, reusable API surface). `apps/api` has a working `/health` endpoint, CORS scoped to the web app's origin, builds and runs clean. GraphQL (S5) and the Postgres/Mongo work (S2) now live in `apps/api`, not in Next.js.
      Next: push to GitHub, connect Vercel (web) + a Node host — Render/Railway (api) — for auto-deploy on push.
- [ ] **S2 (Wed)** — Postgres (Neon free tier) + Prisma schema: users/roles/students/classes/enrollments, seed script.
- [ ] **S3 (Fri)** — Auth (NextAuth or hand-rolled JWT) with role field + RBAC middleware; login page redirects by role.

**Done when:** live Vercel URL exists, four role logins land on four distinct dashboards.
