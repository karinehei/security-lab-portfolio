export type Role = "USER" | "ADMIN";

export type Actor = {
  id: string;
  email: string;
  role: Role;
};

export type RagDocument = {
  id: string;
  ownerId: string;
  title: string;
  content: string;
};

export type RetrievedChunk = {
  documentId: string;
  ownerId: string;
  title: string;
  content: string;
  score: number;
};

export type AuditEvent = {
  at: string;
  actorId: string;
  query: string;
  labMode: string;
  retrievedDocumentIds: string[];
};

export type AskResult = {
  answer: string;
  retrieved: RetrievedChunk[];
  audit: AuditEvent;
};
