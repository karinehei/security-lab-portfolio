import { getLabMode } from "./config.js";
import { generateAnswer } from "./mockLlm.js";
import { retrieve } from "./retriever.js";
import { DocumentStore } from "./store.js";
import type { Actor, AskResult, RagDocument } from "./types.js";

/**
 * Application API for the local RAG lab (in-process).
 *
 * User → this function → retriever → document store → mock LLM → answer
 */
export function ask(input: {
  actor: Actor;
  documents: RagDocument[];
  query: string;
}): AskResult {
  const query = input.query.trim();
  if (query.length === 0) {
    throw new Error("query is required");
  }

  const store = new DocumentStore(input.documents);
  const retrieved = retrieve(input.actor, store.listAll(), query);
  const answer = generateAnswer(query, retrieved);

  return {
    answer,
    retrieved,
    audit: {
      at: new Date().toISOString(),
      actorId: input.actor.id,
      query,
      labMode: getLabMode(),
      retrievedDocumentIds: retrieved.map((chunk) => chunk.documentId),
    },
  };
}
