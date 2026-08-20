# Scenario — Sensitive information disclosure

**Status:** Partially evidenced. The v1 leak path is **retrieval**, not model memorization or training-data extraction. No attempt is made to extract secrets from a hosted model.

OWASP alignment (name only): **Sensitive Information Disclosure**. Overlaps the RAG ACL scenario when the secret is another user’s document.

---

## Threat

Confidential strings (lab markers standing in for compensation / merger text) appear in an answer for a user who should not see them.

## Asset

`MARKER_ALICE_PRIVATE_COMPENSATION`, `MARKER_BOB_PRIVATE_MERGER`, and the surrounding document bodies.

## Entry point

Generated answer returned by `ask()`, populated only from retrieved chunks in v1 (the mock has no weights and no hidden system prompt containing secrets).

## Precondition

Sensitive text lives in the store. A query causes retrieval. Authorization is either present or skipped (`LAB_MODE`).

## Attack scenario

Same chain as [rag-access-control](../rag-access-control/README.md): Alice queries `merger` and, without ACL, receives Bob’s marker. Other SID classes (prompt leaking a hidden system secret, model memorizing training PII) are **not** built here.

## Expected security boundary

- Do not retrieve unauthorised documents.
- Do not put secrets in system prompts or logs casually (audit currently stores the query; queries could be sensitive — residual).
- Do not send lab markers to third-party APIs (v1 sends nothing off-box).

## Observed behaviour

See RAG ACL tests: Bob’s marker is present in Alice’s mock answer only when `LAB_MODE=vulnerable`.

System-prompt leakage and training-data extraction: **not observed** because there is no such model.

## Impact

Confidentiality of tenant documents. In a product, this is the difference between a private knowledge base and a cross-customer incident.

## Mitigation

C-RAG-ACL, C-FILTER-FIRST, C-MOCK-LLM (no exfil channel). Planned: redact or drop secrets in audit logs; output encoding in any UI.

## Verification

`npm run test:all` in this module. Markers are synthetic and exist only in `src/seed.ts`.

## Residual risk

- Audit logs contain the raw query.
- A future real LLM could still disclose Alice’s *own* sensitive text to Alice (expected) or hallucinate others’ data (misinformation class — not tested).
- Embedding indexes in a later version must inherit the same ACL or they become a parallel SID path.
