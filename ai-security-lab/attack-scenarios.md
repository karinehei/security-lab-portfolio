# Attack scenarios (index)

All scenarios are **local and synthetic**. None are instructions for attacking a hosted AI product.

| Scenario | Folder | Code in v1 |
| --- | --- | --- |
| RAG document-level access control | [rag-access-control](./scenarios/rag-access-control/README.md) | Yes — `src/acl.ts`, `src/retriever.ts`, `tests/` |
| Direct prompt injection | [prompt-injection](./scenarios/prompt-injection/README.md) | No — evaluation design only |
| Indirect prompt injection | [indirect-prompt-injection](./scenarios/indirect-prompt-injection/README.md) | No — evaluation design only |
| Sensitive information disclosure | [sensitive-information-disclosure](./scenarios/sensitive-information-disclosure/README.md) | Partial — same leak class as RAG ACL |

Each folder uses the same sections: Threat, Asset, Entry point, Precondition, Attack scenario, Expected security boundary, Observed behaviour, Impact, Mitigation, Verification, Residual risk.

## Shared story

```text
User A
  ↓
retrieval request ("merger")
  ↓
Retriever without ACL
  ↓
User B's private document in the prompt
  ↓
Mock answer contains B's marker
```

The secure boundary is **filter-then-retrieve**, not **retrieve-then-hope-the-model-redacts**.
