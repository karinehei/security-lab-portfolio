import { isVulnerableMode } from "./config.js";
import type { Actor, RagDocument } from "./types.js";

/**
 * Document-level authorization for RAG retrieval.
 *
 * Secure mode: a chunk may be retrieved only if the actor owns it, or is ADMIN.
 * Vulnerable mode: any authenticated actor may retrieve any stored document
 * that matches the search, which is cross-tenant leakage through the retriever.
 *
 * LAB VULNERABILITY: missing object ACL on retrieval (same class as WEB-001 / BOLA,
 * applied to the RAG document store rather than GET /api/documents/:id).
 */
export function canRetrieveDocument(actor: Actor, document: RagDocument): boolean {
  if (actor.role === "ADMIN") {
    return true;
  }

  if (isVulnerableMode()) {
    // LAB VULNERABILITY (intentional): skip ownership filter during retrieval.
    return true;
  }

  return document.ownerId === actor.id;
}
