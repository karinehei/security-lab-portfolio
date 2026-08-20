# Verification report

**Date:** 20 August 2026  
**Environment:** WSL Ubuntu-24.04, repository at `/mnt/d/security-lab-portfolio`  
**Scope:** Local labs only. No third-party systems were targeted.

Results use only **PASS**, **FAIL**, or **NOT IMPLEMENTED**. Failures found during this run were fixed where reasonable; those changes are listed after the table.

| Check | Result | Evidence | Notes |
| --- | --- | --- | --- |
| `npm install` (API + RAG labs) | PASS | API: `up to date, audited 203 packages`, exit 0, `found 0 vulnerabilities`. RAG: `audited 64 packages`, exit 0 | Run in WSL against `web-api-security/vulnerable-api` and `ai-security-lab`. |
| `npm run typecheck` | PASS | API `tsc --noEmit` exit 0. RAG `tsc --noEmit` exit 0 | Typecheck is the static check this repo actually ships. |
| `npm test` | PASS | Before the alias change, API `vitest run` followed `.env` (`LAB_MODE=vulnerable`): **9 passed / 7 skipped**. RAG (code default secure): **3 passed / 1 skipped**. `npm run test:all` (the dual-mode suite CI uses): API **13 passed / 3 skipped** then **9 passed / 7 skipped**, exit 0; RAG **3 passed / 1 skipped** then **1 passed / 3 skipped**, exit 0 | Bare `npm test` previously did **not** prove remediation when `.env` set `LAB_MODE=vulnerable` (secure suites skipped). `package.json` `test` is now an alias of `test:all`. That alias was not re-run end-to-end in this session because `test:all` had already passed. |
| `npm run lint` | NOT IMPLEMENTED | `npm error Missing script: "lint"` in both labs | No ESLint/Prettier script exists. Typecheck is not treated as lint. |
| `docker compose config` | PASS | Exit 0. Rendered `LAB_MODE: vulnerable`. Published ports use `host_ip: 127.0.0.1` for **3000** and **5432** | Compose default remains vulnerable-on-loopback by design (documented in the API README). Residual risk if someone republishes ports. |
| Semgrep (policy) | PASS | `semgrep/semgrep:latest` with `--entrypoint semgrep` + `scan --config policy.yaml --error --severity ERROR`: **0 findings**, exit 0 | First attempt failed: image `CMD` is `semgrep --help`, so a bare `scan` argument was `exec: "scan" not found`. Policy YAML also failed to parse until `ignoreExpiration: true` was quoted. |
| Semgrep (lab coverage) | PASS | Scan: **3 findings** on `documentAuthz.ts`, `authService.ts`, `acl.ts`. After assert-script fix: `Lab-coverage OK: security-lab.idor-skip-ownership, security-lab.jwt-ignore-expiration, security-lab.rag-skip-ownership` | Assert initially **failed** because check ids were prefixed `devsecops.semgrep.`. CI would have failed the same way. Pinned image `semgrep/semgrep:1.128.1` was not pulled in this environment; local proof used `latest`. |
| Gitleaks | PASS | `zricethezav/gitleaks:latest detect --no-git`: `no leaks found`, exit 0 | Allowlist covers only documented placeholders (`LabPassw0rd!`, `local-lab-jwt-secret-not-for-production`, `postgresql://lab:lab@`). |
| Trivy | PASS | `aquasec/trivy:latest fs`: `TRIVY_FS_EXIT:0`. API `package-lock.json`: **0** vulnerabilities | Filesystem scan, not the CI image scan after `docker build`. AI lab lockfile has no production deps. Critical image scan was not repeated locally. |
| Local vulnerable API starts | PASS | `GET http://127.0.0.1:3000/health` → `labMode: vulnerable`, `status: ok` | Postgres container `vulnerable-api-db-1` healthy on `127.0.0.1:5432`. Host process via `npx tsx src/index.ts`. |
| Vulnerable mode demonstrates the defect | PASS | Alice JWT `GET` of Bob’s document: **200**, body contained `bob-secret-marker`. Login `expiresInSeconds`: `null` | Matches WEB-001 / WEB-002 vulnerable behaviour. |
| Secure mode blocks it | PASS | After freeing `:3000`, health `labMode: secure`. Alice `GET` Bob’s document: **403**, secret not returned. `expiresInSeconds`: **900** | First secure smoke was invalid: SIGTERM on `npm start` left a vulnerable listener on 3000. Re-test killed the port and started with explicit `LAB_MODE=secure`. |
| Production refuses vulnerable mode | PASS | `NODE_ENV=production LAB_MODE=vulnerable npm start` exit **1**: `Refusing to start: LAB_MODE=vulnerable is forbidden when NODE_ENV=production` | `assertLabSafety()` in `src/config.ts`. |
| Regression tests prove remediation | PASS | Secure suites: IDOR **403**, JWT `exp` / 15-minute TTL, expired token rejected. Vulnerable suites still demonstrate the training defects. RAG secure tests omit Bob’s marker; vulnerable test includes it | Dual-mode skip pattern is intentional. |
| Documentation matches implementation | PASS | WEB-001 ↔ `canReadDocument` / `GET /api/documents/:id`. WEB-002 ↔ `authService.ts` (bcrypt in both modes; `exp` only in secure). RAG-ACL-001 ↔ `acl.ts` filter-then-retrieve. Prompt injection folders remain docs-only | Compose default `LAB_MODE=vulnerable` is stated in the API README and WEB-001. |
| Links between README, reports, and source | PASS | After fixes, relative Markdown targets resolve (230 links checked across 36 repo Markdown files, excluding `node_modules`) | Two broken paths were real: `idor-lab.md` and `rag-access-control/README.md` pointed at `../../reports/` (one directory short). |
| No real credentials or secrets | PASS | Pattern grep (AWS/GitHub/OpenAI/Slack-style keys) on repo files excluding `node_modules`: **none**. Gitleaks exit 0. `.env` is gitignored; `.env.example` uses fictional lab values | Placeholders only. Do not reuse them outside this lab. |
| Security tests do not contact external systems | PASS | API tests use Supertest against the in-process Express app + local Postgres. RAG tests call in-process `ask()`. No `fetch` / HTTP client in `src/` or `tests/` of either lab | Vitest talks to `127.0.0.1` Postgres from `.env`, not to vendor APIs. Scanner images pulling vulnerability DBs is tooling, not a lab test. |
| GitHub Actions configuration is valid | PASS | `.github/workflows/security.yml` loads as YAML: job `security`, 15 named steps (checkout, Node 20, Prisma, typecheck, `test:all` both labs, Semgrep policy + coverage, npm audit, Gitleaks, Docker build, Trivy CRITICAL). `permissions: contents: read`. No live secrets in the file | PyYAML maps the key `on` to boolean `True` (GitHub still accepts `on:`). Semgrep steps now use `--entrypoint semgrep`. Image pin `1.128.1` was not verified by a local pull. |
| README does not exaggerate skills or completed exercises | PASS | Evidence table points at artefacts. TryHackMe: four **intro** rooms documented (snapshot 20 Aug 2026); public profile `https://tryhackme.com/p/karinehei`. Prompt injection: evaluation design, not a model assessment. No certs or scores | Tagline originally said “AI/LLM security evaluation”; it now says “local RAG access-control labs”. `skills.md` keeps Planned rows without artefacts. |

## What changed during verification

1. **Semgrep YAML** — quoted `pattern: "ignoreExpiration: true"` in `policy.yaml` and `lab-coverage.yaml` (unquoted colon was invalid YAML).
2. **Semgrep Docker invocation** — `.github/workflows/security.yml` and `devsecops/ci/run-local.sh` now use `--entrypoint semgrep` plus `scan ...`.
3. **Lab-coverage assert** — `assert-lab-sast.py` accepts check ids prefixed with the config path (`devsecops.semgrep.security-lab.*`). Without this, CI would fail despite three real matches.
4. **Semgrep path filters** — includes/excludes use `**/...` globs (Semgrepignore v2 warning).
5. **Broken links** — `web-api-security/vulnerable-api/docs/idor-lab.md` and `ai-security-lab/scenarios/rag-access-control/README.md` now point at `../../../reports/WEB-001-...`.
6. **`npm test`** — both labs alias `test` to `test:all` so the default command covers secure and vulnerable modes. API README updated.
7. **Root README** — tagline no longer claims LLM evaluation; two-minute path links here.

Temporary WSL helper scripts used for this run were deleted and are not part of the portfolio.

## Residual risk (not scored as FAIL)

- Compose still defaults `LAB_MODE=vulnerable` on loopback. That is the training default, not a production deployment.
- Local Trivy proof is filesystem scan. CI’s **image** scan after `docker build` was not repeated here.
- CI still pins `semgrep/semgrep:1.128.1`; this machine used `latest` because the pinned tag did not pull.

---

## Portfolio status

This repository is a **local, dual-mode security lab**, not a list of production pentests or certifications.

A recruiter can see, in code and in tests:

- **Web/API security:** an Express + Prisma document API with an intentional IDOR on `GET /api/documents/:id` (WEB-001) and intentional JWT session-expiration failure (WEB-002). Passwords are bcrypt in both modes. Secure mode enforces owner/admin ACL and 15-minute HS256 tokens.
- **Secure coding + regression:** Vitest proves the defect still exists in `LAB_MODE=vulnerable` and is blocked in `LAB_MODE=secure`.
- **DevSecOps:** GitHub Actions runs typecheck, both test modes, Semgrep (policy + lab-coverage), npm audit (High+), Gitleaks, image build, and Trivy (Critical).
- **AI/RAG security:** a mock retriever (no vendor LLM) with the same object-ACL class (RAG-ACL-001). Prompt injection is written up as evaluation design only.

It does **not** demonstrate Burp/Nmap notes, cloud/K8s hardening, or a real-model jailbreak assessment. TryHackMe evidence is four introductory walkthrough rooms, not a completed web/OWASP path. Those deeper rows stay Planned until artefacts exist.
