import type { RetrievedChunk } from "./types.js";

/**
 * Deterministic stand-in for an LLM. It only formats retrieved chunks.
 * It does not call a vendor API, follow hidden instructions, or browse the network.
 * That is deliberate: v1 evaluates retrieval ACL, not model jailbreaks.
 */
export function generateAnswer(query: string, chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return `No authorised documents matched the query ${JSON.stringify(query)}.`;
  }

  const body = chunks
    .map((chunk) => `[${chunk.documentId} owner=${chunk.ownerId}] ${chunk.content}`)
    .join("\n");

  return `Mock answer for ${JSON.stringify(query)} using ${chunks.length} chunk(s):\n${body}`;
}
