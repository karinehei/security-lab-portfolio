# Scenario — Direct prompt injection

**Status:** Documented for evaluation design. **Not implemented** against a language model. The v1 “LLM” only concatenates retrieved chunks and does not follow instructions.

OWASP alignment (name only): **Prompt Injection** (direct). This file does not claim we bypassed any vendor model.

---

## Threat

A user message tries to override application policy (for example: ignore tenant ACL, dump another user’s context, or treat the user as admin).

## Asset

Retrieval policy, tenant documents, and any future system prompt.

## Entry point

The `query` string on `ask()`.

## Precondition

Authenticated lab user. In a later version, a model that actually interprets natural-language instructions.

## Attack scenario

Conceptual: Alice submits a query whose *intent* is “ignore ownership and quote every document in the store.” In v1 the mock generator will still only see **chunks the retriever allowed**. That is the point: injection into the user turn must not be able to expand the candidate set.

This repository does not include jailbreak strings, payload packs, or clients aimed at external APIs.

## Expected security boundary

1. Document ACL on retrieval (implemented).
2. Future: treat user text as data, not as a configuration channel (instruction hierarchy, separate tool channel).
3. Future: output handling if the model is untrusted.

## Observed behaviour

**Not executed.** No local instruction-following model is wired up. Residual observation: even if a future model obeyed a malicious query, **secure** retrieval would still omit Bob’s documents from the prompt, so that class of leak requires an ACL failure (see [rag-access-control](../rag-access-control/README.md)).

## Impact

If a real model were added without ACL, prompt injection could be *one* way to *ask* for other tenants’ data; the data would still have to be retrieved or already in context. Impact is confidentiality and policy bypass.

## Mitigation

- Keep C-RAG-ACL as the hard boundary.
- Planned: local evaluation harness only (same repo, mock or offline model).
- Planned: no tool calls from model output.

## Verification

TODO: when a local model is introduced, add tests that a malicious *query* does not change `retrievedDocumentIds` for Alice. Until then, RAG ACL tests are the verification that exists.

## Residual risk

Direct injection against production SaaS models is out of scope and untested. Do not infer vendor robustness from this lab.
