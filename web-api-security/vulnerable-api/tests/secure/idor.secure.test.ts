import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, bearer, login } from "../helpers.js";

/**
 * Secure-mode regression: object-level authorization on document read.
 * Skipped when LAB_MODE=vulnerable so the training defect can still be demonstrated.
 */
describe.skipIf(process.env.LAB_MODE === "vulnerable")(
  "IDOR control (LAB_MODE=secure)",
  () => {
    it("lets an owner read their own document", async () => {
      const bobToken = await login("bob@local.lab");
      const created = await request(app)
        .post("/api/documents")
        .set(bearer(bobToken))
        .send({
          title: "Bob secure-mode fixture",
          content: "Only Bob or an admin should read this in secure mode.",
        })
        .expect(201);

      const own = await request(app)
        .get(`/api/documents/${created.body.id}`)
        .set(bearer(bobToken))
        .expect(200);

      expect(own.body.content).toBe(created.body.content);
    });

    it("blocks a different user from reading the document by id", async () => {
      const bobToken = await login("bob@local.lab");
      const created = await request(app)
        .post("/api/documents")
        .set(bearer(bobToken))
        .send({
          title: "Bob confidential fixture",
          content: "Alice must receive 403 in secure mode.",
        })
        .expect(201);

      const aliceToken = await login("alice@local.lab");
      const denied = await request(app)
        .get(`/api/documents/${created.body.id}`)
        .set(bearer(aliceToken))
        .expect(403);

      expect(denied.body.error).toBeDefined();
      expect(denied.body.content).toBeUndefined();
    });

    it("allows an administrator to read another user's document", async () => {
      const bobToken = await login("bob@local.lab");
      const created = await request(app)
        .post("/api/documents")
        .set(bearer(bobToken))
        .send({
          title: "Bob document for admin read",
          content: "Admins may read all documents.",
        })
        .expect(201);

      const adminToken = await login("admin@local.lab");
      const response = await request(app)
        .get(`/api/documents/${created.body.id}`)
        .set(bearer(adminToken))
        .expect(200);

      expect(response.body.id).toBe(created.body.id);
    });

    it("lists only the caller's documents for a normal user", async () => {
      const aliceToken = await login("alice@local.lab");
      const response = await request(app)
        .get("/api/documents")
        .set(bearer(aliceToken))
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      for (const document of response.body) {
        expect(document.ownerId).toBeDefined();
      }

      const me = await request(app)
        .get("/api/me")
        .set(bearer(aliceToken))
        .expect(200);

      for (const document of response.body) {
        expect(document.ownerId).toBe(me.body.id);
      }
    });
  },
);
