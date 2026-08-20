import type { RagDocument } from "./types.js";

export class DocumentStore {
  constructor(private readonly documents: RagDocument[]) {}

  listAll(): RagDocument[] {
    return [...this.documents];
  }

  getById(id: string): RagDocument | undefined {
    return this.documents.find((row) => row.id === id);
  }
}
