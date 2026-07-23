# Ilm (علم — "knowledge")

Practice project: a multi-role student management system, built to close specific gaps against two target job descriptions while reinforcing real CV strengths (Node/Express, Microservices Architecture, Docker/K8s). See `NOTES.md` for the session-by-session build log.

## Structure

```
ilm/
├── apps/
│   ├── admin/                  :5174 — Vite + React + TS + React Router + Ant
│   │                          Design + Ant Design Pro's ProComponents. The
│   │                          admin/dashboard UI — plain client-side React, no
│   │                          framework underneath (ported off UmiJS Max in
│   │                          full — see NOTES.md). Calls the three services
│   │                          directly (no proxy); each service's CORS config
│   │                          allows this origin.
│   │
│   ├── web/                  Next.js 14 (App Router) + TS + Tailwind — the
│   │                          public-facing side (catalog/announcements,
│   │                          SSR/ISR for SEO) plus the BFF proxy pattern at
│   │                          app/api/[service]/[...path]. Its own /dashboard
│   │                          route still exists as a reference for the BFF
│   │                          approach, but apps/admin is where the real
│   │                          admin UI is being built.
│   │
│   ├── auth-service/          :4001 — Express + TS. Users, roles, JWT issuing,
│   │                          RBAC. Every other service verifies tokens against it.
│   │
│   ├── academic-service/      :4002 — Express + TS. Students, classes, enrollments,
│   │                          attendance, grades (Postgres/Prisma) + free-text
│   │                          teacher notes (MongoDB) + the GraphQL layer.
│   │
│   └── notification-service/  :4003 — Express + TS. Real-time alerts (Socket.io +
│                              Redis pub/sub) when a grade or announcement lands.
│
├── README.md
└── NOTES.md                   Running build log, updated every session.
```

Three backend services, not five — `student-service`, `attendance-service`,
and `grade-service` were consolidated into `academic-service` since they share
the same relational data and would otherwise call each other constantly for
no real isolation benefit. `auth-service` and `notification-service` earn
their own boundary: auth is a genuine trust boundary every other service
depends on, and notifications are event-driven rather than request/response.

**Two frontends, on purpose, not by accident.** `apps/admin` is a plain React
SPA — no BFF, each service called directly from the browser, CORS doing the
real work. `apps/web` is Next.js with a BFF proxy — one entry point for all
three services, no CORS needed at all since calls happen server-to-server.
Building the same idea both ways is deliberate: it's what makes the "why
Next.js over plain React" tradeoff a real, felt thing instead of a talking
point memorized from a plan.

## Running locally

```
# terminal 1
cd apps/auth-service && npm run dev          # http://localhost:4001

# terminal 2
cd apps/academic-service && npm run dev      # http://localhost:4002

# terminal 3
cd apps/notification-service && npm run dev  # http://localhost:4003

# terminal 4 — plain React admin (the one being actively built)
cd apps/admin && npm run dev                 # http://localhost:5174

# terminal 5 — Next.js public site + BFF (optional, for the SEO/proxy side)
cd apps/web && npm run dev                   # http://localhost:3000
```
