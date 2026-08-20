# AI / LLM / RAG security lab

Local, synthetic RAG pipeline used to study **authorization of retrieved context**. No hosted model, no vendor API key, and no testing of third-party chat products.

This is the part of the portfolio that connects application security (the same BOLA class as [WEB-001](../reports/WEB-001-broken-object-level-authorization.md)) with information retrieval: if the retriever can see User B’s private chunk, the language model never gets a chance to “be ethical” about it.

```text
User
  ↓
Application API   (ask() in src/pipeline.ts)
  ↓
Retriever         (keyword search + ACL)
  ↓
Document store    (in-memory seed)
  ↓
LLM               (deterministic mock — formats chunks only)
  ↓
Generated answer
```

## What is implemented (v1)

| Item | Status |
| --- | --- |
| RAG **document-level access control** | Implemented — [`src/acl.ts`](./src/acl.ts), [scenario](./scenarios/rag-access-control/README.md), [tests](./tests) |
| Direct prompt injection | Documented only |
| Indirect prompt injection | Documented only |
| Sensitive information disclosure | Documented only (overlap with RAG ACL) |

`LAB_MODE=secure` (code default) filters the document store **before** ranking. `LAB_MODE=vulnerable` searches every tenant’s documents so the training leak is visible. `NODE_ENV=production` refuses vulnerable mode.

## What this is not

- Not a jailbreak toolkit
- Not a fuzzer for ChatGPT, Claude, Gemini, or any other external service
- Not a claim that the mock “LLM” exhibits real instruction-following. Prompt-injection folders describe **how we would evaluate** a future local model; they are not pass/fail evidence yet.

OWASP references are **alignment** with published LLM Top 10 names (see [threat-model.md](./threat-model.md)). This lab is not an OWASP certification.

## Run (WSL)

```bash
cd /mnt/d/security-lab-portfolio/ai-security-lab
npm install
npm run test:all

# Alice asks about "merger" — Bob owns that document
LAB_MODE=vulnerable npx tsx src/index.ts --user alice --query merger
LAB_MODE=secure npx tsx src/index.ts --user alice --query merger
```

Secure mode should omit Bob’s marker `MARKER_BOB_PRIVATE_MERGER`. Vulnerable mode includes it.

## Layout

```text
ai-security-lab/
├── README.md
├── threat-model.md
├── attack-scenarios.md
├── controls.md
├── src/                 ← pipeline, retriever, mock LLM
├── tests/               ← RAG ACL automated checks
└── scenarios/
    ├── prompt-injection/
    ├── indirect-prompt-injection/
    ├── rag-access-control/          ← first technical scenario
    └── sensitive-information-disclosure/
```

## Related evidence in this repository

- Same authorization class on REST: [WEB-001](../reports/WEB-001-broken-object-level-authorization.md)
- Session after retrieval is out of scope here; API JWT TTL is [WEB-002](../reports/WEB-002-authentication-security.md)
