import type { Document } from "@prisma/client";
import { canReadDocument } from "../authz/documentAuthz.js";
import { documentRepository } from "../repositories/documentRepository.js";
import type { AuthenticatedUser } from "../types.js";

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function listDocumentsFor(actor: AuthenticatedUser): Promise<Document[]> {
  if (actor.role === "ADMIN") {
    return documentRepository.findAll();
  }
  return documentRepository.findByOwner(actor.id);
}

export async function readDocument(
  actor: AuthenticatedUser,
  documentId: number,
): Promise<Document> {
  const document = await documentRepository.findById(documentId);
  if (!document) {
    throw new NotFoundError("Document not found");
  }

  if (!canReadDocument(actor, document)) {
    throw new ForbiddenError("You are not allowed to read this document");
  }

  return document;
}

export function createDocument(
  actor: AuthenticatedUser,
  input: { title: string; content: string },
): Promise<Document> {
  return documentRepository.create({
    title: input.title,
    content: input.content,
    ownerId: actor.id,
  });
}
