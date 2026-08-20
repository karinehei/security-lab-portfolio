# Scenario — RAG document-level access control

**Status:** Implemented (local mock pipeline). Finding class aligns with broken object-level authorization on a search path, not with a hosted-model jailbreak.

OWASP alignment (names only, not a certified audit): **Sensitive Information Disclosure**; **Vector and Embedding Weaknesses** / insecure retrieval; same CWE family as [WEB-001](../../../reports/WEB-001-broken-object-level-authorization.md) ([CWE-639](https://cwe.mitre.org/data/definitions/639.html), [CWE-285](https://cwe.mitre.org/data/definitions/285.html)). Also comparable to OWASP API1 BOLA when the “object” is a retrieved chunk.

---

## Threat

An authenticated user causes the retriever to load another user’s private documents into the LLM context, then receives that text in the generated answer.

## Asset

Bob’s confidential lab document `doc-bob-merger`, identified in tests by `MARKER_BOB_PRIVATE_MERGER`.

## Entry point

Application API: `ask({ actor, documents, query })` — in v1 the CLI `src/index.ts` and Vitest. Stands in for `POST /rag/query` on a real service.

## Precondition

- Caller is Alice (`user-alice`), role `USER`.
- Store contains Bob’s merger note and Alice’s own notes.
- Query string overlaps Bob’s document (lab uses `merger`).
- `LAB_MODE=vulnerable` for the failing boundary; `LAB_MODE=secure` for the control.

## Attack scenario

Conceptual, local only:

```text
User A (Alice)
  ↓
retrieval request  query = "merger"
  ↓
Retriever ranks the whole store (no owner filter)
  ↓
Retriever returns User B's private document
  ↓
Mock LLM echoes the chunk
  ↓
Alice's answer contains MARKER_BOB_PRIVATE_MERGER
```

No external service is queried. No exploit kit is shipped. Tests call `ask()` in-process.

## Expected security boundary

The retriever may only rank documents for which `canRetrieveDocument(actor, doc)` is true (owner or admin). The mock LLM must never see Bob’s chunk for Alice. System-prompt wording is **not** the boundary.

## Observed behaviour

| Mode | Alice + query `merger` |
| --- | --- |
| `LAB_MODE=vulnerable` | `doc-bob-merger` is retrieved; answer contains `MARKER_BOB_PRIVATE_MERGER` |
| `LAB_MODE=secure` | Bob’s id is absent from `retrieved`; answer does not contain that marker |
| `LAB_MODE=secure`, Alice + `compensation` | Alice’s own document still retrieved |
| `LAB_MODE=secure`, admin + `merger` | Admin may retrieve Bob’s document |

Evidence: [tests/rag-access-control.secure.test.ts](../../tests/rag-access-control.secure.test.ts), [tests/rag-access-control.vulnerable.test.ts](../../tests/rag-access-control.vulnerable.test.ts).

## Impact

Cross-tenant confidentiality failure: private notes become part of another user’s answer. In a product RAG this is HR, legal, or customer data in the wrong context window. The model cannot reliably un-see a chunk once it is retrieved.

## Mitigation

Implemented in [`src/acl.ts`](../../src/acl.ts) / [`src/retriever.ts`](../../src/retriever.ts):

- Filter the store by owner (or admin) **before** scoring.
- Keep a training switch only under `LAB_MODE=vulnerable` and never in `NODE_ENV=production`.
- Audit `retrievedDocumentIds` so a leak is visible in logs.

Do not “fix” this by asking the mock (or a future model) to redact other users’ names.

## Verification

```bash
npm run test:secure
npm run test:vulnerable
```

Manual:

```bash
LAB_MODE=secure npx tsx src/index.ts --user alice --query merger
LAB_MODE=vulnerable npx tsx src/index.ts --user alice --query merger
```

## Residual risk

- Keyword search is not semantic search; a different query might not hit Bob’s doc even in vulnerable mode (tests use an overlapping term).
- Admin override is total; a real product needs finer roles.
- No persistence or HTTP authn in v1 (identity is a function argument).
- Prompt injection against a real model is **not** covered here; ACL still required if that is added later.
