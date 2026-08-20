# Tests

Automated checks for the **local** RAG lab. They never call a hosted model.

| Suite | What it proves |
| --- | --- |
| [rag-access-control.secure.test.ts](./rag-access-control.secure.test.ts) | Retrieval ACL drops another tenant's chunks; mock answer has no `MARKER_BOB_PRIVATE` for Alice |
| [rag-access-control.vulnerable.test.ts](./rag-access-control.vulnerable.test.ts) | Training defect: Alice's "merger" query retrieves Bob's document |

```bash
cd ai-security-lab
npm install
npm run test:all
```

Prompt injection, indirect injection, and sensitive-disclosure **scenario docs** are not claimed as passing model-level tests. Those folders describe evaluation design; they do not ship exploit scripts or vendor API calls.
