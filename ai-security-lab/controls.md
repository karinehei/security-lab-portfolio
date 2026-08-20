# Controls

Controls are listed as **implemented**, **partial**, or **planned**. Planned items are not claimed as working.

| ID | Control | Threats addressed | State | Where |
| --- | --- | --- | --- | --- |
| C-RAG-ACL | Deny-by-default document ACL on retrieval (`ownerId` or `ADMIN`) | Cross-user retrieval, inadequate document authorization, SID via RAG | Implemented | [`src/acl.ts`](./src/acl.ts) |
| C-FILTER-FIRST | Apply ACL to the candidate set before ranking / prompt assembly | Same; also limits blast radius of a gullible model | Implemented | [`src/retriever.ts`](./src/retriever.ts) |
| C-MODE-GATE | `LAB_MODE=vulnerable` forbidden when `NODE_ENV=production` | Accidental production leak of the training switch | Implemented | [`src/config.ts`](./src/config.ts) |
| C-MOCK-LLM | No network, no tools, no vendor key | Excessive agency, supply-chain of a SaaS LLM | Implemented (scope reduction) | [`src/mockLlm.ts`](./src/mockLlm.ts) |
| C-AUDIT | Record actor, query, lab mode, retrieved IDs | Weak audit logging | Partial (in-memory JSON only) | [`src/pipeline.ts`](./src/pipeline.ts) |
| C-K-CAP | Retriever `k` is bounded | Unbounded context / some DoS | Partial | [`src/retriever.ts`](./src/retriever.ts) |
| C-OUTPUT-POLICY | Treat model output as untrusted (no `eval`, no shell) | Unsafe trust in generated output | Planned for a future UI | — |
| C-INJECTION-EVAL | Local tests for direct/indirect injection against a **local** model | Prompt injection | Planned — see scenario folders | — |
| C-TOOL-ALLOWLIST | Tools disabled unless explicitly listed | Excessive agency | Planned (mock has zero tools) | — |

## Design rule

Authorization is a property of the **document** and the **actor**, decided in application code. Embedding similarity, prompt wording, and “please don’t leak” system text are not substitutes.

That is the same rule as [WEB-001](../reports/WEB-001-broken-object-level-authorization.md) on `GET /api/documents/:id`, applied to search.
