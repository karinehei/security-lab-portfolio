# Skills mapping

TryHackMe is input. This repository is output. A concept is not “done” because a room exists on a path; it is evidenced when I can show the loop below against **code I maintain**.

```text
TryHackMe exercise
        ↓
Concept understood
        ↓
Own local security lab
        ↓
Vulnerability analysis (report)
        ↓
Remediation (LAB_MODE=secure)
        ↓
Regression testing (Vitest / CI)
```

I recently started using TryHackMe. Four **intro walkthrough** rooms are completed (see [progress.md](./progress.md)). Rows marked **Planned** on the THM side mean a named room in that *track* is not done yet. The local lab column can still be **Documented** when this repository already contains the work.

**Public profile:** [https://tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei)  
**Progress table:** [progress.md](./progress.md)

## How to read a row

| Column | Meaning |
| --- | --- |
| Concept | Class of issue or skill, not a spoiler for a specific question |
| TryHackMe | Hands-on training status in this repo |
| Own lab | Module in this git tree |
| Finding | Report ID, or “none yet” |
| Remediation | Where the fix lives |
| Automated verification | Tests or pipeline that lock the control |

## Broken access control

```text
Broken Access Control
        → TryHackMe hands-on training (planned named web room; intro rooms do not cover BOLA)
        → Local BOLA / IDOR API lab
        → Pentest finding WEB-001
        → Secure implementation (owner/admin ACL)
        → Automated regression test
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| Access control / IDOR / BOLA | [Planned track](./notes/web-application-security.md) | [vulnerable-api](../web-api-security/vulnerable-api) `GET /api/documents/:id` | [WEB-001](../reports/WEB-001-broken-object-level-authorization.md) | [`documentAuthz.ts`](../web-api-security/vulnerable-api/src/authz/documentAuthz.ts) `LAB_MODE=secure` | [idor.secure.test.ts](../web-api-security/vulnerable-api/tests/secure/idor.secure.test.ts); Semgrep `security-lab.idor-skip-ownership` |
| RAG document ACL (same class on retrieval) | No THM room claimed | [ai-security-lab](../ai-security-lab) | [RAG-ACL-001](../ai-security-lab/scenarios/rag-access-control/README.md) | [`acl.ts`](../ai-security-lab/src/acl.ts) filter-then-retrieve | [rag-access-control.secure.test.ts](../ai-security-lab/tests/rag-access-control.secure.test.ts) |

## Authentication

```text
Authentication / session lifetime
        → TryHackMe hands-on training (planned OWASP / API room)
        → Local JWT issue and verify
        → Pentest finding WEB-002
        → Short-lived HS256 tokens with exp
        → Automated regression test
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| Authentication and session lifetime (OWASP A07 / API2) | [Planned track](./notes/owasp-related-training.md) | [vulnerable-api](../web-api-security/vulnerable-api) JWT issue/verify | [WEB-002](../reports/WEB-002-authentication-security.md) | [`authService.ts`](../web-api-security/vulnerable-api/src/services/authService.ts) short-lived `exp` | [auth.secure.test.ts](../web-api-security/vulnerable-api/tests/secure/auth.secure.test.ts); Semgrep `security-lab.jwt-ignore-expiration` |

## Web security

```text
Web application security
        → TryHackMe hands-on training (planned web room)
        → Local Express document API
        → Findings WEB-001 and WEB-002
        → Dual-mode secure coding
        → Vitest + CI
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| Web application security (HTTP APIs, object IDs, sessions) | [Planned track](./notes/web-application-security.md) | [vulnerable-api](../web-api-security/vulnerable-api) | WEB-001, WEB-002 | `LAB_MODE=secure` paths in authz and auth | `npm run test:all` in the API lab |

## API security

```text
API security
        → TryHackMe hands-on training (planned OWASP / API room)
        → REST document API on localhost
        → OWASP API1 and API2 write-ups
        → Deny-by-default ACL and token TTL
        → Secure vs vulnerable test suites
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| REST / OWASP API Top 10 (API1, API2) | [Planned track](./notes/owasp-related-training.md) | [vulnerable-api](../web-api-security/vulnerable-api) | [WEB-001](../reports/WEB-001-broken-object-level-authorization.md), [WEB-002](../reports/WEB-002-authentication-security.md) | Secure lab mode | [tests/secure](../web-api-security/vulnerable-api/tests/secure) |

## OWASP concepts

```text
OWASP (API1 BOLA, A07 / API2 broken authentication)
        → TryHackMe hands-on training (planned)
        → Local labs aligned to those categories
        → Reports with CWE / CVSS reasoning
        → Secure implementations
        → Regression tests + Semgrep lab coverage
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| OWASP labels used as communication, not as a bingo card | [Planned track](./notes/owasp-related-training.md) | Same API lab | WEB-001, WEB-002 | Code in `src/authz` and `src/services/authService.ts` | Vitest; [lab-coverage.yaml](../devsecops/semgrep/lab-coverage.yaml) |

## Linux

```text
Linux fundamentals
        → TryHackMe hands-on training (TODO — no room claimed)
        → Local use of WSL, Docker, Makefile
        → No pentest finding
        → Loopback-only Compose
        → CI on ubuntu-latest
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| Linux as a lab environment | TODO: named room — **not claimed** | WSL + [Makefile](../Makefile) + [docker-compose.yml](../web-api-security/vulnerable-api/docker-compose.yml) | none yet | Ports published on `127.0.0.1` | GitHub Actions `runs-on: ubuntu-latest` |

## Networking

```text
Networking fundamentals
        → TryHackMe hands-on training (TODO — no room claimed)
        → Local bind to loopback, health checks
        → No network pentest finding
        → Do not scan hosts outside this repo
        → Tests talk to localhost / in-process only
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| Host/port scope for labs | TODO: named room — **not claimed**; Nmap row in [skills.md](../skills.md) stays Planned | API on `127.0.0.1:3000` | Process, not a CVE | [lab-rules.md](../docs/lab-rules.md) | Tests do not contact external systems ([verification-report.md](../docs/verification-report.md)) |

## Security tooling

```text
Security tooling
        → TryHackMe hands-on training (TODO — no room claimed)
        → Semgrep, Gitleaks, npm audit, Trivy in this repo
        → DevSecOps pipeline notes
        → Policy vs intentional lab defects
        → GitHub Actions gate
```

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| SAST / secrets / SCA / image scan | TODO: named room — **not claimed** | [devsecops](../devsecops) | Intentional lab patterns listed in [expected-findings.md](../devsecops/semgrep/expected-findings.md) | Policy excludes known lab files; coverage still requires the patterns | [`.github/workflows/security.yml`](../.github/workflows/security.yml) |
| Intercepting proxy (Burp) | Planned — THM machines only when a room is done | TODO: optional note against `127.0.0.1` | — | — | — |

## Engagement discipline (pentesting fundamentals)

| Concept | TryHackMe | Own security lab | Finding | Remediation | Automated verification |
| --- | --- | --- | --- | --- | --- |
| Scope, authorised targets only | **Completed (intro):** [Offensive Security Intro](./notes/offensive-security-intro.md). Deeper path still [Planned](./notes/pentesting-fundamentals.md) | [lab-rules.md](../docs/lab-rules.md), [methodology.md](../docs/methodology.md) | Process, not a CVE | Dual-mode labs; no third-party targets | Pipeline does not scan the internet |
| Defence as a discipline (intro) | **Completed (intro):** [Defensive Security Intro](./notes/defensive-security-intro.md) | [devsecops](../devsecops) | none from this room | Secure lab mode + CI | [security.yml](../.github/workflows/security.yml) |

When a placeholder track in [progress.md](./progress.md) is completed, replace “Planned track” with `notes/<room-slug>.md`. Do not add Hack The Box or certifications here unless those artefacts exist in the repository.
