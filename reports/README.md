# Reports

Pentest-style write-ups of findings in **this repository's local labs**. Each report is tied to code, a lab mode, and automated tests.

Reports are not generic vulnerability essays. They describe a specific component, a specific request, and a specific fix.

## Index

| ID | Title | Lab | Severity |
| --- | --- | --- | --- |
| [WEB-001](./WEB-001-broken-object-level-authorization.md) | Broken Object Level Authorization (IDOR) on document read | [vulnerable-api](../web-api-security/vulnerable-api) | High (CVSS 6.5 base; confidentiality of user documents) |
| [WEB-002](./WEB-002-authentication-security.md) | Insufficient JWT session expiration | [vulnerable-api](../web-api-security/vulnerable-api) | Medium (CVSS 5.3 base; durable session after token exposure) |
| [RAG-ACL-001](../ai-security-lab/scenarios/rag-access-control/README.md) | Cross-user RAG retrieval (scenario sheet, not a pentest HTTP report) | [ai-security-lab](../ai-security-lab) | Confidentiality of tenant chunks; see scenario |

## Report standard

Every report uses the same sections: finding ID, title, OWASP, CWE, severity, CVSS reasoning, affected component, description, prerequisites, reproduction, evidence, impact, root cause, remediation, verification, secure implementation, and lessons learned.

Reproduction steps apply only to the local application named in the report.

## Planned

TODO: WEB-003 and later, once additional lab vulnerabilities are implemented one at a time.
