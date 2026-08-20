# Architecture

The lab is a small REST service with a clear split between HTTP, authentication, authorization, and data access. Training defects are isolated behind `LAB_MODE` in two functions only.

```text
HTTP routes
  → middleware (authn, admin role)
    → services (use cases)
      → authService.ts            ← WEB-002 JWT lifetime (LAB_MODE branch)
      → authz/documentAuthz.ts    ← WEB-001 IDOR (LAB_MODE branch)
      → repositories (Prisma)
        → PostgreSQL
```

## Why this shape

A hiring reviewer should be able to point at **one function per finding** and see both the insecure lab behaviour and the secure control. Password hashing, listing filters, and admin checks are not mixed into those switches.

## Modes

| `LAB_MODE` | `NODE_ENV` | Document `GET /:id` | Access token |
| --- | --- | --- | --- |
| `secure` (code default) | any | Owner or `ADMIN` | 15-minute `exp`, expiration enforced |
| `vulnerable` | `development` (and not `production`) | Any authenticated user | No `exp`; `ignoreExpiration: true` |
| `vulnerable` | `production` | Process refuses to start | Process refuses to start |

## What is *not* a lab defect

To keep each lesson isolated:

- `GET /api/documents` still returns the caller's documents (or all documents for an admin).
- `POST /api/documents` always sets `ownerId` from the authenticated user.
- `GET /api/admin/users` still requires `ADMIN`.
- Passwords are stored as bcrypt hashes in **both** modes. Seed values are fictional.
- JWTs remain HS256-signed in both modes (no `alg: none`).

WEB-001 contrast: **listing is filtered, direct reference is not**.  
WEB-002 contrast: **password hashing is sound, session TTL is not**.

## Runtime

- Bind address: `LISTEN_HOST` (loopback on the host; `0.0.0.0` inside the API container). Compose still publishes `127.0.0.1:3000`.
- Database: PostgreSQL 16 via Docker Compose.
- Authn: JWT in `Authorization: Bearer`.
