# Ilm — build log

Running notes for the 1hr/day sessions. Update at the end of every session: what shipped, what's next.

## Week 1 — Live skeleton + auth

- [x] **S1 (Mon)** — Next.js 14 + TS + Tailwind scaffold, `npm run build` verified clean, git initialized.
- [x] **S1b** — Added Ant Design for the `/dashboard` route only (via `@ant-design/nextjs-registry` for App Router SSR), public `/` stays pure Tailwind. Decision: Tailwind closes the JD2 gap on public/marketing pages; Ant Design reinforces the CV strength on the data-heavy authenticated dashboards — a deliberate split, not a random mix. Verified via `npm run build`: `/` is 5.35 kB, `/dashboard` carries its own 107 kB antd bundle, no SSR/hydration errors.
- [x] **S1c** — Restructured into `apps/web` (Next.js) + `apps/api` (Express + TS). Decision: Node/Express is the strongest, most-proven skill on the CV (6 yrs, backbone of every listed project) — a real API boundary between frontend and backend is a more realistic senior-level architecture than Next.js route handlers doing everything, and gives a clean "why did you separate these" interview answer (independent deploy targets, reusable API surface). `apps/api` has a working `/health` endpoint, CORS scoped to the web app's origin, builds and runs clean. GraphQL (S5) and the Postgres/Mongo work (S2) now live in `apps/api`, not in Next.js.
- [x] **S1d** — Split `apps/api` into three services instead of one, and instead of the originally-requested five: `auth-service` (:4001), `academic-service` (:4002 — student + attendance + grade merged, since they share the same relational data and gain nothing from being separate), `notification-service` (:4003). Each has its own `/health` endpoint, verified running concurrently. Decision: five full services didn't fit the 12-build-hour budget (each needs inter-service auth + a way for notifications to react to academic events); three keeps a real bounded-context story — auth as a genuine trust boundary, notifications as event-driven vs. request/response — without the setup tax of five. Each service will own its own Postgres database/schema (not shared) once S2 lands, which is the correct microservices pattern even though it's more setup than one shared DB.
      Next: push to GitHub, connect Vercel (web) + a Node host — Render/Railway (services) — for auto-deploy on push.

**Ownership of the remaining roadmap, updated:**
- S2 (Postgres/Prisma) → split: `auth-service` owns users/roles; `academic-service` owns students/classes/enrollments/attendance/grades.
- S3 (auth/RBAC) → `auth-service`, issues JWTs the other two services verify.
- S5 (GraphQL), S6 (Mongo notes) → `academic-service`.
- `notification-service`'s real logic (Socket.io + Redis pub/sub) stays in the deferred/stretch list from the original plan — scaffolded now, implemented later if time allows.
- [ ] **S2 (Wed)** — Postgres (Neon free tier) + Prisma schema: users/roles/students/classes/enrollments, seed script.
- [ ] **S3 (Fri)** — Auth (NextAuth or hand-rolled JWT) with role field + RBAC middleware; login page redirects by role.

**Done when:** live Vercel URL exists, four role logins land on four distinct dashboards.
