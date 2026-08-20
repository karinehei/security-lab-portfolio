# Skills matrix

Two-minute view: [README.md](./README.md). This table is the inventory. Evidence is listed only when this repository contains a lab, a test, a report, or a pipeline artefact. Rows without artefacts stay **Planned**.

Status values:

- **Planned** — no artefact, or docs-only with no implemented control/tests
- **Lab implemented** — local code exists
- **Documented** — lab plus a report or scenario sheet (and usually tests)

| Area | Technology / Tool | Practical evidence | Status |
| --- | --- | --- | --- |
| Web Security | Local Node.js/Express lab | [vulnerable-api](./web-api-security/vulnerable-api) | Lab implemented |
| API Security | REST, Express, JWT | [WEB-001](./reports/WEB-001-broken-object-level-authorization.md); [WEB-002](./reports/WEB-002-authentication-security.md); [API tests](./web-api-security/vulnerable-api/tests) | Documented |
| Broken Access Control | OWASP API1 / object-level checks | [WEB-001](./reports/WEB-001-broken-object-level-authorization.md); [documentAuthz.ts](./web-api-security/vulnerable-api/src/authz/documentAuthz.ts) | Documented |
| IDOR / BOLA | `GET /api/documents/:id` | [WEB-001](./reports/WEB-001-broken-object-level-authorization.md); [idor.vulnerable.test.ts](./web-api-security/vulnerable-api/tests/vulnerable/idor.vulnerable.test.ts); [idor.secure.test.ts](./web-api-security/vulnerable-api/tests/secure/idor.secure.test.ts) | Documented |
| Authentication | Email/password, bcrypt, JWT session | [WEB-002](./reports/WEB-002-authentication-security.md); [authService.ts](./web-api-security/vulnerable-api/src/services/authService.ts); [auth.secure.test.ts](./web-api-security/vulnerable-api/tests/secure/auth.secure.test.ts); [auth.vulnerable.test.ts](./web-api-security/vulnerable-api/tests/vulnerable/auth.vulnerable.test.ts) | Documented |
| Authentication testing | Token TTL, expired JWT, login errors | [WEB-002 Reproduction](./reports/WEB-002-authentication-security.md#reproduction); Vitest auth suites | Documented |
| Secure password handling | bcrypt hash + compare in both lab modes | [seed.ts](./web-api-security/vulnerable-api/prisma/seed.ts); [authenticate()](./web-api-security/vulnerable-api/src/services/authService.ts); WEB-002 notes that hashing is *not* the defect | Documented |
| Token / session security | HS256 JWT `exp`, algorithm allowlist | [WEB-002](./reports/WEB-002-authentication-security.md); secure `signSecureAccessToken` / `verifySecureAccessToken` | Documented |
| Authorization | Ownership + admin role (API and RAG) | [documentAuthz.ts](./web-api-security/vulnerable-api/src/authz/documentAuthz.ts); [ai-security-lab acl.ts](./ai-security-lab/src/acl.ts) | Documented |
| Access Control | Object ACL on REST GET and on RAG retrieval | [WEB-001](./reports/WEB-001-broken-object-level-authorization.md); [RAG-ACL-001](./ai-security-lab/scenarios/rag-access-control/README.md) | Documented |
| Authorization testing | User A reads user B's object | [WEB-001 Reproduction](./reports/WEB-001-broken-object-level-authorization.md#reproduction) | Documented |
| Secure coding | Deny-by-default ACL; short-lived tokens | WEB-001 and WEB-002 secure implementations | Documented |
| Regression testing | Vitest + Supertest, both lab modes | [package.json](./web-api-security/vulnerable-api/package.json) `test:all` | Documented |
| OWASP Top 10 | API1 BOLA; A07 / API2 Broken Authentication | [WEB-001](./reports/WEB-001-broken-object-level-authorization.md); [WEB-002](./reports/WEB-002-authentication-security.md) | Documented (API1 + API2/A07) |
| TryHackMe (platform learning) | Guided rooms on TryHackMe | [tryhackme/progress.md](./tryhackme/progress.md) — profile TODO: `https://tryhackme.com/p/<USERNAME>`; no completed rooms claimed | Planned |
| Burp Suite | Intercepting proxy | TODO: local-lab note against `127.0.0.1` only | Planned |
| Nmap | Host/port discovery | TODO: optional localhost Compose ports only | Planned |
| Docker Security | Loopback Compose + image scan | [docker-compose.yml](./web-api-security/vulnerable-api/docker-compose.yml); [Trivy](./devsecops/trivy) | Documented (baseline + CI scan) |
| Container security | Trivy on the lab image | [devsecops/trivy](./devsecops/trivy); [security.yml](./.github/workflows/security.yml) Trivy step | Documented |
| Dependency Security | npm audit (High+) | [`audit:ci`](./web-api-security/vulnerable-api/package.json); [security.yml](./.github/workflows/security.yml) | Documented |
| SAST | Semgrep policy + lab coverage | [devsecops/semgrep](./devsecops/semgrep); [expected-findings.md](./devsecops/semgrep/expected-findings.md) | Documented |
| Secrets Detection | Gitleaks + documented placeholders | [gitleaks.toml](./devsecops/gitleaks/gitleaks.toml); [exceptions.md](./devsecops/exceptions.md) | Documented |
| CI/CD Security | GitHub Actions gate, no live secrets in YAML | [security.yml](./.github/workflows/security.yml); [ci/README.md](./devsecops/ci/README.md) | Documented |
| DevSecOps | SAST, SCA, secrets, image, tests in one pipeline | [devsecops/README.md](./devsecops/README.md) | Documented |
| Cloud Security | AWS / Terraform / Kubernetes | TODO: isolated hardening note only | Planned |
| Threat Modeling | Data-flow + STRIDE for local RAG | [ai-security-lab/threat-model.md](./ai-security-lab/threat-model.md); [controls.md](./ai-security-lab/controls.md) | Documented |
| Security Evaluation | Dual-mode tests; scenario sheets | [ai-security-lab/tests](./ai-security-lab/tests); [attack-scenarios.md](./ai-security-lab/attack-scenarios.md) | Documented |
| AI Security | Local synthetic RAG (no vendor API) | [ai-security-lab](./ai-security-lab) | Lab implemented |
| LLM Security | Mock generator (no vendor API, no tools) | [mockLlm.ts](./ai-security-lab/src/mockLlm.ts) — does **not** evaluate a production LLM | Lab implemented (mock only) |
| RAG Security | Filter-then-retrieve document ACL | [retriever.ts](./ai-security-lab/src/retriever.ts); [rag-access-control](./ai-security-lab/scenarios/rag-access-control/README.md); Vitest suites | Documented |
| Prompt Injection | Direct/indirect evaluation design | [prompt-injection](./ai-security-lab/scenarios/prompt-injection/README.md); [indirect-prompt-injection](./ai-security-lab/scenarios/indirect-prompt-injection/README.md) — **not** executed against a real model | Planned (documented only) |

## How this matrix will grow

New rows (or a status change from Planned) require a path in this repository. Completing a TryHackMe room updates [tryhackme/progress.md](./tryhackme/progress.md) and a dated file under [tryhackme/notes/](./tryhackme/notes) first, then this table. Placeholder tracks are not completions.
