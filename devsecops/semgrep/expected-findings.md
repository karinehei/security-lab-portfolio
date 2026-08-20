# Expected Semgrep findings (intentional lab code)

These matches are **required**. They are training defects gated by `LAB_MODE=vulnerable`.

| Rule ID | File | Finding | Report |
| --- | --- | --- | --- |
| `security-lab.idor-skip-ownership` | `web-api-security/vulnerable-api/src/authz/documentAuthz.ts` | Ownership check skipped in vulnerable mode | [WEB-001](../../reports/WEB-001-broken-object-level-authorization.md) |
| `security-lab.jwt-ignore-expiration` | `web-api-security/vulnerable-api/src/services/authService.ts` | `ignoreExpiration: true` | [WEB-002](../../reports/WEB-002-authentication-security.md) |
| `security-lab.rag-skip-ownership` | `ai-security-lab/src/acl.ts` | Retrieval ACL skipped in vulnerable mode | [RAG-ACL-001](../../ai-security-lab/scenarios/rag-access-control/README.md) |

CI job **Semgrep lab coverage** fails if any required rule produces **zero** hits.

These are not “won’t fix” product bugs. Secure mode (`LAB_MODE=secure`) implements the mitigation; tests lock both behaviours.

If a **new** Semgrep hit appears outside this table, treat it as accidental until proven otherwise. Do not add it here to silence CI.
