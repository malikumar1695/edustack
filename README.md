# Ilm (علم — "knowledge")

Practice project: a multi-role student management system, built to close specific gaps against two target job descriptions while reinforcing real CV strengths (Node/Express, Microservices Architecture, Docker/K8s). See `NOTES.md` for the session-by-session build log.

## Structure

```
ilm/
├── apps/
│   ├── web/                  Next.js 14 (App Router) + TS + Tailwind — frontend.
│   │                          Public pages (catalog/announcements, SSR/ISR) stay
│   │                          pure Tailwind. Authenticated /dashboard is scoped to
│   │                          Ant Design (SSR via @ant-design/nextjs-registry) —
│   │                          a deliberate split, not a mix.
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

Three services, not five — `student-service`, `attendance-service`, and
`grade-service` were consolidated into `academic-service` since they share the
same relational data and would otherwise call each other constantly for no
real isolation benefit. `auth-service` and `notification-service` earn their
own boundary: auth is a genuine trust boundary every other service depends on,
and notifications are event-driven rather than request/response.

## Running locally

```
# terminal 1
cd apps/auth-service && npm run dev          # http://localhost:4001

# terminal 2
cd apps/academic-service && npm run dev      # http://localhost:4002

# terminal 3
cd apps/notification-service && npm run dev  # http://localhost:4003

# terminal 4
cd apps/web && npm run dev                   # http://localhost:3000
```
