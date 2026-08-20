# Web and API security

Local labs for authorization, authentication, and OWASP-aligned API defects. All targets are applications in this folder, started on localhost.

## Implemented

| Lab | Focus | Report |
| --- | --- | --- |
| [vulnerable-api](./vulnerable-api) | Document API with `LAB_MODE=vulnerable` / `secure`. **WEB-001** IDOR on `GET /api/documents/:id`. **WEB-002** JWT session expiration. | [WEB-001](../reports/WEB-001-broken-object-level-authorization.md), [WEB-002](../reports/WEB-002-authentication-security.md) |

## Planned

TODO: additional local findings on the same API (mass assignment, injection) — one vulnerability per iteration, each with a report and tests.

TODO: a second lab for browser-side issues (session handling, CSRF) if it stays relevant to my Node.js background.

Nothing in this folder is a scanner target list. Run modules with Docker Compose as documented in each lab README.
