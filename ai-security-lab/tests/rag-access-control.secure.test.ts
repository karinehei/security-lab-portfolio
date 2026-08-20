import { describe, expect, it } from "vitest";
import { ask } from "../src/pipeline.js";
import { ACTORS, MARKER_ALICE_PRIVATE, MARKER_BOB_PRIVATE, seedDocuments } from "../src/seed.js";

describe.skipIf(process.env.LAB_MODE === "vulnerable")(
  "RAG document ACL (LAB_MODE=secure)",
  () => {
    it("does not retrieve Bob's private merger notes for Alice", () => {
      const result = ask({
        actor: ACTORS.alice,
        documents: seedDocuments(),
        query: "merger",
      });

      expect(result.retrieved.map((chunk) => chunk.ownerId)).not.toContain(
        ACTORS.bob.id,
      );
      expect(result.answer).not.toContain(MARKER_BOB_PRIVATE);
      expect(result.audit.labMode).toBe("secure");
    });

    it("still retrieves Alice's own compensation notes for Alice", () => {
      const result = ask({
        actor: ACTORS.alice,
        documents: seedDocuments(),
        query: "compensation",
      });

      expect(result.retrieved.some((chunk) => chunk.documentId === "doc-alice-comp")).toBe(
        true,
      );
      expect(result.answer).toContain(MARKER_ALICE_PRIVATE);
    });

    it("allows an administrator to retrieve Bob's document", () => {
      const result = ask({
        actor: ACTORS.admin,
        documents: seedDocuments(),
        query: "merger",
      });

      expect(result.retrieved.some((chunk) => chunk.documentId === "doc-bob-merger")).toBe(
        true,
      );
      expect(result.answer).toContain(MARKER_BOB_PRIVATE);
    });
  },
);
