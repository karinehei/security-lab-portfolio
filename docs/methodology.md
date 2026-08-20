# Methodology

This portfolio uses a single assessment loop so that reports, code, tests, and CI stay aligned.

```text
Discover → Validate → Assess → Fix → Test → Automate
```

(The longer names used in some write-ups are Identify, Reproduce, Assess, Remediate, Verify, plus the CI pipeline.)

## Discover (Identify)

Look for missing or inconsistent security controls in a local application: authentication, authorization, input handling, configuration, or data exposure.

For WEB-001, the control gap is **object-level authorization** on document read: the list endpoint is filtered by owner, but the direct object reference is not.

Identification is a design and code-review activity as much as a testing activity. In this repository it starts from reading the handler and the `LAB_MODE` branch, then confirming the behaviour at runtime.

## Validate (Reproduce)

Confirm the behaviour with a **minimal, local** request. Reproduction is not a generic exploit; it is a documented call to this lab's API:

- method, path, and authenticated identity
- object identifier that belongs to another user
- observed status code and body in vulnerable mode
- observed status code in secure mode

Keep reproduction inside Docker / localhost. Record only what is needed for a reviewer to repeat the check on their machine.

## Assess

Place the issue in a standard language hiring managers and security teams share:

- **OWASP** category (for APIs, typically API1 Broken Object Level Authorization)
- **CWE** (for IDOR / BOLA, CWE-639 / CWE-285)
- **Severity** with CVSS reasoning, plus business impact in plain language
- **Prerequisites** (for WEB-001: a valid low-privilege session)

Separate *what the tester observes* from *what the developer should change*.

## Fix (Remediate)

Implement the control in the same codebase, behind `LAB_MODE=secure`:

- deny by default
- authorize on the object, not only on the route
- allow administrators only through an explicit role check
- avoid leaking other users' data in error paths where it is practical

The secure implementation is the artefact that shows engineering judgement, not only that a weakness can be found.

## Test (Verify)

Verification has two layers:

1. **Manual** — repeat the original request in secure mode and confirm it is denied.
2. **Automated** — Vitest coverage that:
   - asserts the training defect is present in vulnerable mode (lab integrity)
   - asserts ownership (and admin override) in secure mode (regression)

## Automate

After tests pass locally, the same controls run in [`.github/workflows/security.yml`](../.github/workflows/security.yml): typecheck, unit tests (API and RAG labs), Semgrep (policy + lab coverage), npm audit, Gitleaks, lab image build, Trivy (Critical, fix available).

A finding is not “portfolio complete” until secure-mode tests pass and, where a Semgrep lab-coverage rule exists, CI still detects the labelled training defect.

## Mapping to artefacts

| Step | Where to look |
| --- | --- |
| Discover | Module README, `LAB VULNERABILITY` comments |
| Validate | Report or scenario “Reproduction” / “Observed behaviour” |
| Assess | OWASP / CWE / CVSS / impact |
| Fix | `LAB_MODE=secure` branches (`documentAuthz.ts`, `authService.ts`, `acl.ts`) |
| Test | `tests/secure` and `tests/vulnerable` (API and RAG) |
| Automate | `.github/workflows/security.yml` |
