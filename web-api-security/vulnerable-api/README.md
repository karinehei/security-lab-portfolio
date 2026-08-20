# Vulnerable API lab (local only)

Intentionally vulnerable **document management REST API** for authorization training. The service is part of the [security-lab-portfolio](../../README.md) and must run on **localhost**.

> **Do not** expose this process, scan other hosts with it, or copy lab passwords into a real system.

## What this lab teaches

Two isolated `LAB_MODE` defects on the same API. They can both be on in vulnerable mode; each has its own tests and report.

| Mode | WEB-001 IDOR on `GET /api/documents/:id` | WEB-002 JWT expiration |
| --- | --- | --- |
| `LAB_MODE=vulnerable` | Any authenticated user can read another user's document by id | Access tokens have no `exp`; expired tokens are accepted |
| `LAB_MODE=secure` | Owner or `ADMIN` only | 15-minute HS256 tokens; expired tokens return `401` |

Reports: [WEB-001](../../reports/WEB-001-broken-object-level-authorization.md), [WEB-002](../../reports/WEB-002-authentication-security.md).  
Design notes: [docs/architecture.md](./docs/architecture.md), [docs/idor-lab.md](./docs/idor-lab.md), [docs/authentication-lab.md](./docs/authentication-lab.md).

## Stack

Node.js, TypeScript, Express, PostgreSQL, Prisma, Docker Compose, Vitest.

## API

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/` | No | JSON index (no HTML UI). Browser view: [screenshot](../../docs/images/vulnerable-api-index.png) |
| `GET` | `/health` | No | `{ status, labMode }`. Browser view: [screenshot](../../docs/images/vulnerable-api-health.png) |
| `POST` | `/api/auth/login` | No | Body `{ "email", "password" }` → JWT |
| `GET` | `/api/me` | Bearer | Current user (no password hash) |
| `GET` | `/api/documents` | Bearer | Caller's documents (`ADMIN` sees all). **Not** the IDOR surface |
| `GET` | `/api/documents/:id` | Bearer | **IDOR training surface** in vulnerable mode |
| `POST` | `/api/documents` | Bearer | Creates a document owned by the caller |
| `GET` | `/api/admin/users` | Bearer + `ADMIN` | User directory, no hashes |

## Lab accounts

Fictional credentials, seeded by `prisma/seed.ts`. Password for every account: `LabPassw0rd!`

| Email | Role |
| --- | --- |
| `alice@local.lab` | `USER` |
| `bob@local.lab` | `USER` |
| `admin@local.lab` | `ADMIN` |

Seeded documents belong to Alice, Bob, and the admin so object ids are easy to compare. Tests also create their own documents so they do not depend on a particular id.

Commands below are for **WSL** (Ubuntu). From Windows, open a WSL shell first. From the repository root, `make help` wraps the same steps; or:

```bash
cd /mnt/d/security-lab-portfolio/web-api-security/vulnerable-api
```

## Run with Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

API: `http://127.0.0.1:3000`  
Postgres: `127.0.0.1:5432` (user `lab`, password `lab`, database `documents_lab`)

Vulnerable mode is the Compose default (`LAB_MODE` defaults to `vulnerable` in `docker-compose.yml`). Switch:

```bash
LAB_MODE=secure docker compose up --build
```

## Run the API on the host (Postgres in Docker)

```bash
docker compose up -d db
cp .env.example .env
npm install
npx prisma generate
npm run db:setup
npm run dev
```

## Tests

PostgreSQL must be up and migrated/seeded. Then:

```bash
npm test                 # both modes (alias of test:all)
npm run test:secure      # IDOR + JWT controls enforced; lab-demo tests skipped
npm run test:vulnerable  # training defects present; secure control tests skipped
npm run test:all
```

## Safety

- [`src/config.ts`](./src/config.ts) — `assertLabSafety()`
- [`src/index.ts`](./src/index.ts) — listen on `LISTEN_HOST` (loopback by default; `0.0.0.0` only inside Compose, with host ports published on `127.0.0.1`)
- [`src/authz/documentAuthz.ts`](./src/authz/documentAuthz.ts) — WEB-001 IDOR branch
- [`src/services/authService.ts`](./src/services/authService.ts) — WEB-002 session-expiration branch
- No third-party APIs, no real customer data, no production secrets
