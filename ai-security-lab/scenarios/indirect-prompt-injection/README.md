# Scenario — Indirect prompt injection

**Status:** Documented for evaluation design. **Not implemented** as a model-level test. No hostile documents are used to attack an external assistant.

OWASP alignment (name only): **Prompt Injection** via retrieved content (indirect). Related: poisoned or untrusted knowledge-base text.

---

## Threat

Text **already in the document store** (uploaded by a user, crawled, or seeded) contains instructions aimed at the generator: alter answers, exfiltrate other chunks, or invoke tools.

## Asset

The context window; any future tool interface; other tenants’ documents if ACL is missing.

## Entry point

Document `content` in the store, selected by the retriever, then passed to the generator.

## Precondition

A document Alice is allowed to retrieve includes adversarial natural language. (If she is *not* allowed to retrieve it, indirect injection never reaches the model — that is why RAG ACL is the first control.)

## Attack scenario

Conceptual: Alice retrieves her own note that says, in prose, to ignore policies or to include other files. A following model might treat that as instruction. In this lab the mock LLM will only **echo** that note; it will not fetch Bob’s documents unless the retriever already did.

No payloads are provided for use against third-party products.

## Expected security boundary

- ACL so Alice cannot retrieve Bob’s objects (implemented).
- Treat retrieved text as untrusted data (planned: delimiters, not executing tool calls from chunk text).
- Human or schema validation before side effects (planned; mock has no side effects).

## Observed behaviour

**Not executed** as an injection eval. The mock will include Alice’s own chunk verbatim if retrieved — that is concatenation, not instruction-following.

Secure RAG ACL tests still show Bob’s marker is absent for Alice even when the query matches Bob’s keywords.

## Impact

On a real model with tools, indirect injection can become excessive agency (browse, email, query other stores). In v1 the impact collapses to: untrusted text in the answer, scoped to documents Alice could already read.

## Mitigation

C-RAG-ACL first. Then untrusted-content handling. Do not grant the generator unrestricted tools.

## Verification

TODO: store a labelled “instruction-like” document owned by Alice; assert `retrievedDocumentIds` still never includes Bob under `LAB_MODE=secure`. That test would be content-policy, not an exploit.

## Residual risk

A future local model might follow instructions inside Alice’s own documents (integrity of *her* answers). That is a different tenant-isolation problem and is not claimed as solved.
