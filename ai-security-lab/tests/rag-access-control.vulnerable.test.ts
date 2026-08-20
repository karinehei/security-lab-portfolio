import { describe, expect, it } from "vitest";
import { ask } from "../src/pipeline.js";
import { ACTORS, MARKER_BOB_PRIVATE, seedDocuments } from "../src/seed.js";

/**
 * Lab-integrity checks: retrieval without an owner filter leaks Bob's chunk into Alice's prompt.
 * Not an attack on any hosted model.
 */
describe.skipIf(process.env.LAB_MODE !== "vulnerable")(
  "RAG document ACL lab demonstration (LAB_MODE=vulnerable)",
  () => {
    it("retrieves Bob's private merger notes for Alice and includes them in the mock answer", () => {
      const result = ask({
        actor: ACTORS.alice,
        documents: seedDocuments(),
        query: "merger",
      });

      expect(result.retrieved.some((chunk) => chunk.documentId === "doc-bob-merger")).toBe(
        true,
      );
      expect(result.answer).toContain(MARKER_BOB_PRIVATE);
      expect(result.audit.labMode).toBe("vulnerable");
    });
  },
);
