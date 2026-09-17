# syntax=docker/dockerfile:1
#
# Build from the REPO ROOT, not this folder:
#   docker build -f apps/auth-service/Dockerfile -t ilm-auth-service .
#
# The context must be the root: this is an npm workspaces monorepo, so the
# image needs the root manifest and packages/* as well as this service.

# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /repo

# Manifests before source: this layer only rebuilds when dependencies change,
# so editing code doesn't trigger a full reinstall.
COPY package.json ./
COPY packages/http-kit/package.json packages/http-kit/
COPY packages/auth-kit/package.json packages/auth-kit/
COPY apps/auth-service/package.json apps/auth-service/

RUN npm install --include-workspace-root \
    --workspace @ilm/http-kit \
    --workspace @ilm/auth-kit \
    --workspace @ilm/auth-service

COPY packages/ packages/
COPY apps/auth-service/ apps/auth-service/

# Shared packages are consumed from dist/, so they build first.
RUN npm run build:packages

WORKDIR /repo/apps/auth-service
# prisma/generated is gitignored build output — regenerate before tsc.
RUN npx prisma generate
RUN npm run build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production

# Fresh filesystem: the builder stage's manifests are not here.
COPY package.json ./
COPY packages/http-kit/package.json packages/http-kit/
COPY packages/auth-kit/package.json packages/auth-kit/
COPY apps/auth-service/package.json apps/auth-service/

# --omit=dev drops typescript, vitest and the prisma CLI. The cache is cleaned
# in the same RUN because layers are additive — a later delete wouldn't shrink it.
RUN npm install --omit=dev --include-workspace-root \
    --workspace @ilm/http-kit \
    --workspace @ilm/auth-kit \
    --workspace @ilm/auth-service \
    && npm cache clean --force

# Compiled output only — no TypeScript sources ship.
COPY --from=builder /repo/packages/http-kit/dist packages/http-kit/dist
COPY --from=builder /repo/packages/auth-kit/dist packages/auth-kit/dist
COPY --from=builder /repo/apps/auth-service/dist apps/auth-service/dist
COPY --from=builder /repo/apps/auth-service/prisma/generated apps/auth-service/prisma/generated

# After the installs, so node_modules stays root-owned and read-only to the app.
USER node
WORKDIR /repo/apps/auth-service

EXPOSE 4001
# Exec form: node runs as PID 1 and receives SIGTERM directly.
CMD ["node", "dist/index.js"]
