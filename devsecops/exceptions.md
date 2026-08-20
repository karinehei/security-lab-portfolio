# Security exceptions

Exceptions are **time-bounded documented decisions**, not a way to hide scanner noise.

Every row needs: ID, tool, what is ignored, why, who (role), and a revisit date. When the date passes, the exception is invalid until renewed.

## Active

| ID | Tool | Target | Reason | Revisit |
| --- | --- | --- | --- | --- |
| EXP-LAB-001 | Gitleaks | `LabPassw0rd!` | Fictional seed password for localhost users; documented in the API README | 2027-02-01 |
| EXP-LAB-002 | Gitleaks | `local-lab-jwt-secret-not-for-production` | Fictional HMAC secret for lab JWTs; `.env` is gitignored; example file is intentional | 2027-02-01 |
| EXP-LAB-003 | Semgrep policy | `authService.ts` `ignoreExpiration` path exclude | WEB-002 training defect; still detected by lab-coverage | 2027-02-01 |
| EXP-LAB-004 | Semgrep policy | `documentAuthz.ts` not flagged by policy | WEB-001 training defect; still detected by lab-coverage | 2027-02-01 |
| EXP-LAB-005 | Gitleaks | `postgresql://lab:lab@` | Documented Compose database DSN, loopback only | 2027-02-01 |

## Resolved by change (not ignored)

| ID | Tool | What happened |
| --- | --- | --- |
| GHSA-ggr8-5vv4-36mx | npm audit | High in `deepmerge-ts` via Prisma ≥ 6.13. **Pinned** `prisma` and `@prisma/client` to `6.12.0` instead of adding an audit exception. |

| ID | Tool | Target | Reason | Revisit |
| --- | --- | --- | --- | --- |
| — | npm audit | — | Add a row if CI must accept a High CVE we cannot upgrade yet | — |
| — | Trivy | — | Add a CVE to `.trivyignore` only with a row here | — |

## Rules for adding a row

1. Prefer upgrading or deleting the code.
2. If you must ignore: smallest possible scope (single CVE, single path).
3. Write the residual risk in one sentence.
4. Set a revisit date no more than six months out.
5. Link a report or issue if it is a lab finding (WEB-00x).

Deleting a scanner because it was noisy is not an exception; it is turning the control off.
