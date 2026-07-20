# Ilm (علم — "knowledge")

Practice project: a multi-role student management system, built to close specific gaps against two target job descriptions while reinforcing real CV strengths. See `NOTES.md` for the session-by-session build log.

## Structure

```
ilm/
├── apps/
│   ├── web/   Next.js 14 (App Router) + TypeScript + Tailwind — frontend.
│   │          Public pages (catalog/announcements, SSR/ISR) stay pure Tailwind.
│   │          Authenticated /dashboard is scoped to Ant Design (SSR via
│   │          @ant-design/nextjs-registry) — a deliberate split, not a mix.
│   └── api/   Express + TypeScript — backend REST/GraphQL API.
│              Talks to Postgres (Prisma) + MongoDB. Deployed separately
│              from web.
└── NOTES.md   Running build log, updated every session.
```

## Running locally

```
# terminal 1
cd apps/api && npm run dev   # http://localhost:4000

# terminal 2
cd apps/web && npm run dev   # http://localhost:3000
```
