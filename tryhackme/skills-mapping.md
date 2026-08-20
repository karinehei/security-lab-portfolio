# Skills mapping

TryHackMe is input. This repository is output. A concept is not “done” because a room exists on a path; it is evidenced when I can show the loop below against **code I maintain**.

```text
TryHackMe concept
        ↓
Own security lab (localhost)
        ↓
Finding (report)
        ↓
Remediation (LAB_MODE=secure)
        ↓
Automated verification (Vitest / CI)
```

## How to read a row

| Column | Meaning |
| --- | --- |
| TryHackMe concept | Class of issue or skill, not a spoiler for a specific question |
| Own lab | Module in this git tree |
| Finding | Report ID, or “none yet” |
| Remediation | Where the fix lives |
| Automated verification | Tests or pipeline that lock the control |
| THM evidence | Progress status — **Planned** until a completed note + profile |

## Mapped (lab exists; THM note not completed)

These rows show where platform learning **should** land. They do not claim the TryHackMe side is finished.

| TryHackMe concept | Own security lab | Finding | Remediation | Automated verification | THM evidence |
| --- | --- | --- | --- | --- | --- |
| Access control / IDOR / BOLA (web app security, OWASP) | [vulnerable-api](../web-api-security/vulnerable-api) `GET /api/documents/:id` | [WEB-001](../reports/WEB-001-broken-object-level-authorization.md) | [`documentAuthz.ts`](../web-api-security/vulnerable-api/src/authz/documentAuthz.ts) `LAB_MODE=secure` | [idor.secure.test.ts](../web-api-security/vulnerable-api/tests/secure/idor.secure.test.ts); Semgrep `security-lab.idor-skip-ownership` | [Planned track](./notes/web-application-security.md) |
| Authentication and session lifetime (OWASP A07 / API2) | [vulnerable-api](../web-api-security/vulnerable-api) JWT issue/verify | [WEB-002](../reports/WEB-002-authentication-security.md) | [`authService.ts`](../web-api-security/vulnerable-api/src/services/authService.ts) short-lived `exp` | [auth.secure.test.ts](../web-api-security/vulnerable-api/tests/secure/auth.secure.test.ts); Semgrep `security-lab.jwt-ignore-expiration` | [Planned track](./notes/owasp-related-training.md) |
| Engagement rules, scope, note-taking (pentesting fundamentals) | [lab-rules.md](../docs/lab-rules.md), [methodology.md](../docs/methodology.md) | Process, not a CVE | Dual-mode labs; no third-party targets | Pipeline does not scan the internet; tests hit localhost | [Planned track](./notes/pentesting-fundamentals.md) |
| Secure SDLC / finding issues before production | [devsecops/](../devsecops) | CI-001 | Policy vs lab-coverage Semgrep, Gitleaks, npm audit, Trivy | [`.github/workflows/security.yml`](../.github/workflows/security.yml) | TODO: THM room TBD — not claimed |

## Not mapped yet

| TryHackMe concept | Own lab | Finding | Remediation | Tests | THM evidence |
| --- | --- | --- | --- | --- | --- |
| Intercepting proxy (Burp) against **THM machines only** | TODO: optional note using Burp against `127.0.0.1` lab, still no THM flags | — | — | — | Planned |
| Host discovery (Nmap) | TODO: Compose ports on loopback only | — | — | — | Planned |
| Cloud / Kubernetes rooms | TODO: [`skills.md`](../skills.md) cloud row | — | — | — | Planned |

When a placeholder track in [progress.md](./progress.md) is completed, replace “Planned track” in the table with `notes/<room-slug>.md` and the profile URL.
