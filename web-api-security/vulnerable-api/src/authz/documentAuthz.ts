import type { Document } from "@prisma/client";
import { isVulnerableMode } from "../config.js";
import type { AuthenticatedUser } from "../types.js";

/**
 * Object-level authorization for document reads.
 *
 * Secure mode (default in application code):
 *   a user may read a document only when they own it, or when they are ADMIN.
 *
 * Vulnerable mode (LAB_MODE=vulnerable, local development only):
 *   any authenticated user may read any document by id.
 *
 * LAB VULNERABILITY: Broken Object Level Authorization / IDOR (OWASP API1, CWE-639).
 * This function is the single place that authorization defect is introduced.
 * Session expiration is isolated in authService.ts (WEB-002).
 */
export function canReadDocument(
  actor: AuthenticatedUser,
  document: Document,
): boolean {
  if (actor.role === "ADMIN") {
    return true;
  }

  if (isVulnerableMode()) {
    // LAB VULNERABILITY (intentional): skip ownership check.
    // Enabled only when LAB_MODE=vulnerable and NODE_ENV is not production
    // (see assertLabSafety in config.ts).
    return true;
  }

  return document.ownerId === actor.id;
}
