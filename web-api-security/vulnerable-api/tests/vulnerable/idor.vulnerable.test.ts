import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, bearer, login } from "../helpers.js";

/**
 * Lab-integrity checks for the intentional IDOR training defect.
 * These assertions document LAB_MODE=vulnerable behaviour; they are not
 * a production acceptance suite. They are skipped in secure mode.
 */
describe.skipIf(process.env.LAB_MODE !== "vulnerable")(
  "IDOR lab demonstration (LAB_MODE=vulnerable)",
  () => {
    it("allows an authenticated user to read another user's document by id", async () => {
      const bobToken = await login("bob@local.lab");
      const created = await request(app)
        .post("/api/documents")
        .set(bearer(bobToken))
        .send({
          title: "Bob vulnerable-mode fixture",
          content: "Training document that Alice must not see in secure mode.",
        })
        .expect(201);

      const aliceToken = await login("alice@local.lab");
      const leaked = await request(app)
        .get(`/api/documents/${created.body.id}`)
        .set(bearer(aliceToken))
        .expect(200);

      expect(leaked.body.id).toBe(created.body.id);
      expect(leaked.body.content).toBe(created.body.content);
      expect(leaked.body.ownerId).toBe(created.body.ownerId);
    });
  },
);
