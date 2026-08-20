import { canRetrieveDocument } from "./acl.js";
import type { Actor, RagDocument, RetrievedChunk } from "./types.js";

const DEFAULT_K = 4;

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 0);
}

function score(query: string, document: RagDocument): number {
  const queryTokens = new Set(tokens(query));
  const haystack = tokens(`${document.title} ${document.content}`);
  let overlap = 0;
  for (const token of haystack) {
    if (queryTokens.has(token)) {
      overlap += 1;
    }
  }
  return overlap;
}

/**
 * Keyword retriever over the in-memory store. No remote embeddings, no hosted API.
 * Authorization is applied to the candidate set *before* ranking, not after the LLM answers.
 */
export function retrieve(
  actor: Actor,
  documents: RagDocument[],
  query: string,
  k = DEFAULT_K,
): RetrievedChunk[] {
  const authorised = documents.filter((document) =>
    canRetrieveDocument(actor, document),
  );

  return authorised
    .map((document) => ({
      documentId: document.id,
      ownerId: document.ownerId,
      title: document.title,
      content: document.content,
      score: score(query, document),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
