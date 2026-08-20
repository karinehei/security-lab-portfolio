# Security Lab Portfolio

Hands-on cybersecurity portfolio demonstrating practical
web/API security testing, secure coding, DevSecOps automation,
and local RAG access-control labs.

Local labs only. Intentionally vulnerable code is labelled `LAB VULNERABILITY`, gated by `LAB_MODE`, and refused when `NODE_ENV=production`. Compose publishes on `127.0.0.1`. Nothing here targets third-party systems.

| Project | Security area | Skills demonstrated | Evidence |
| --- | --- | --- | --- |
| [vulnerable-api](./web-api-security/vulnerable-api) | **Web/API security** | Broken access control (IDOR / BOLA), authentication and JWT sessions, REST assessment, OWASP API1 / A07 / API2 | [WEB-001](./reports/WEB-001-broken-object-level-authorization.md) · [WEB-002](./reports/WEB-002-authentication-security.md) · [secure tests](./web-api-security/vulnerable-api/tests/secure) |
| Same lab, `LAB_MODE=secure` | **Security engineering** | Vulnerability remediation, secure coding, automated regression testing | [`documentAuthz.ts`](./web-api-security/vulnerable-api/src/authz/documentAuthz.ts) · [`authService.ts`](./web-api-security/vulnerable-api/src/services/authService.ts) · `npm run test:all` |
| [devsecops](./devsecops) + [security.yml](./.github/workflows/security.yml) | **DevSecOps** | Semgrep SAST, Gitleaks, Trivy, npm audit, CI/CD gates | [expected findings](./devsecops/semgrep/expected-findings.md) · [exceptions](./devsecops/exceptions.md) |
| [tryhackme](./tryhackme) | **Hands-on training** | TryHackMe note structure, CTF-style *controlled* exercises (this repo’s labs) | [progress.md](./tryhackme/progress.md) — **no rooms marked complete**; profile TODO: `https://tryhackme.com/p/<USERNAME>` |
| [ai-security-lab](./ai-security-lab) | **AI security** | RAG document-level access control, prompt-injection *concepts*, sensitive-data exposure via retrieval, threat modelling | [RAG-ACL-001](./ai-security-lab/scenarios/rag-access-control/README.md) · [threat-model.md](./ai-security-lab/threat-model.md) · [tests](./ai-security-lab/tests) |

Prompt injection is documented as an evaluation design. It is **not** claimed as a completed model-level assessment. There are no certifications, pass-rates, or scorecards in this repository.

---

## Security workflow

```text
Discover → Validate → Assess → Fix → Test → Automate
```

| Step | Meaning in this repo |
| --- | --- |
| **Discover** | Find a missing control in a local lab (`LAB VULNERABILITY` comments) |
| **Validate** | Reproduce on localhost only (documented HTTP or in-process `ask()`) |
| **Assess** | OWASP / CWE / CVSS reasoning and impact in a report or scenario sheet |
| **Fix** | Correct behaviour in `LAB_MODE=secure` (deny-by-default ACL, token `exp`) |
| **Test** | Vitest: vulnerable mode still shows the training defect; secure mode blocks it |
| **Automate** | GitHub Actions: typecheck, tests, Semgrep, npm audit, Gitleaks, image build, Trivy |

Detail: [docs/methodology.md](./docs/methodology.md). Scope: [SECURITY.md](./SECURITY.md), [docs/lab-rules.md](./docs/lab-rules.md).

---

## Two-minute path

1. This table (what is evidenced vs planned).
2. [WEB-001](./reports/WEB-001-broken-object-level-authorization.md) — object-level authorization on `GET /api/documents/:id`.
3. [WEB-002](./reports/WEB-002-authentication-security.md) — JWT expiration (passwords already bcrypt).
4. [RAG-ACL-001](./ai-security-lab/scenarios/rag-access-control/README.md) — same ACL class on retrieval, mock LLM (no vendor API).
5. [`.github/workflows/security.yml`](./.github/workflows/security.yml) — how findings are kept from regressing.
6. [docs/verification-report.md](./docs/verification-report.md) — what was actually run locally.

Full inventory: [skills.md](./skills.md) (rows without artefacts stay **Planned**).

From WSL at the repository root, `make help` lists install, test, Compose, and scanner targets.

---

## Safety

- Vulnerable mode cannot start if `NODE_ENV=production`.
- API Compose ports: `127.0.0.1:3000` and `127.0.0.1:5432` only.
- Host default bind: `LISTEN_HOST=127.0.0.1`. Inside Compose the process listens on `0.0.0.0` **in the container**; the published ports remain loopback.
- RAG lab is in-process (no HTTP listener).
- Lab passwords and JWT material are fictional placeholders.

Do not deploy these images or bind them to a public interface.
