# DevSecOps

Security controls in the **delivery path** for this portfolio: static analysis, dependency review, secrets detection, image scanning, and a GitHub Actions gate.

The pipeline does not scan the public internet. It scans **this repository** and a **locally built lab image**.

Recruiter path: read this page, then [`.github/workflows/security.yml`](../.github/workflows/security.yml), then [expected findings](./semgrep/expected-findings.md) versus [exceptions](./exceptions.md).

## Why this exists

WEB-001 and WEB-002 show that a human can find IDOR and immortal JWTs in a lab API. RAG-ACL-001 shows the same class on retrieval. That is necessary and not sufficient. The same classes should be **visible in CI**.

```text
Checkout
   ↓
Install dependencies
   ↓
TypeScript checks
   ↓
Unit tests (API + RAG labs, both modes)
   ↓
Semgrep SAST (policy + lab coverage)
   ↓
Dependency audit (npm audit)
   ↓
Gitleaks
   ↓
Docker image build
   ↓
Trivy container scan
```

Canonical workflow: [`.github/workflows/security.yml`](../.github/workflows/security.yml)  
Local notes: [`ci/README.md`](./ci/README.md)

## What “fail the build” means

| Check | Fails CI when | Does not fail CI when |
| --- | --- | --- |
| TypeScript | `tsc` errors | n/a |
| Unit tests | Any Vitest failure | n/a |
| Semgrep **policy** | High-confidence rules in [`semgrep/policy.yaml`](./semgrep/policy.yaml) (ERROR) | Documented lab files excluded from those rules |
| Semgrep **lab coverage** | Intentional lab patterns are **missing** | Patterns are present (that is success) |
| npm audit | High/Critical issues in the API lockfile, unless listed in [`exceptions.md`](./exceptions.md) | Low/moderate, or a dated exception |
| Gitleaks | Credential-like strings not on the allowlist | Fictional lab placeholders listed in [`gitleaks/gitleaks.toml`](./gitleaks/gitleaks.toml) |
| Trivy | **Critical** *fixed* vulnerabilities in the lab image | Unfixed upstream CVEs; High findings are reported and reviewed |

Intentional lab defects (IDOR skip, `ignoreExpiration: true`) are **not** treated as accidental product bugs. They must still be **detected** (lab-coverage job) and **named** in reports WEB-001 and WEB-002.

## Intentional vs accidental

| Kind | Example | Handling |
| --- | --- | --- |
| Intentional lab finding | `ignoreExpiration: true` in `authService.ts` | Semgrep lab-coverage must match; policy rules exclude that path; pentest report exists |
| Accidental vulnerability | The same flag copied into a new file | Policy rule fires; CI fails; no exception without a dated entry in [`exceptions.md`](./exceptions.md) |
| Accidental secret | A real AWS key | Gitleaks fails; do not allowlist it |
| Known lab placeholder | `LabPassw0rd!`, `local-lab-jwt-secret-not-for-production` | Gitleaks allowlist with a comment; never reuse outside the lab |

## False positives

Scanners guess. A false positive is handled by **recording it**, not by deleting the rule.

1. Confirm it is not a real issue (code review).
2. Prefer a more precise rule (pattern-inside, path exclude) over a global disable.
3. If a suppression is required, add a dated row to [`exceptions.md`](./exceptions.md) with owner, reason, and revisit date.
4. Inline `nosemgrep` / `# gitleaks:allow` only next to the line, with a finding ID or exception ID.

Silence without a paper trail is how exceptions become permanent holes.

## Tool folders

| Path | Role |
| --- | --- |
| [`semgrep/`](./semgrep) | Policy rules + lab-coverage rules |
| [`gitleaks/`](./gitleaks) | Secrets allowlist for fictional lab values |
| [`trivy/`](./trivy) | Image scan policy and ignore file |
| [`ci/`](./ci) | How to read the GitHub workflow and run a subset locally |

## Scope

- Targets: this git tree and the image built from `web-api-security/vulnerable-api/Dockerfile`
- Not in scope: other GitHub orgs, live URLs, customer clusters
