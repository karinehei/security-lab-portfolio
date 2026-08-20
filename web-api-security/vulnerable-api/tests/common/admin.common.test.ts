import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, bearer, login } from "../helpers.js";

describe("GET /api/admin/users", () => {
  it("denies a normal user", async () => {
    const token = await login("alice@local.lab");
    await request(app)
      .get("/api/admin/users")
      .set(bearer(token))
      .expect(403);
  });

  it("allows an administrator and omits password hashes", async () => {
    const token = await login("admin@local.lab");
    const response = await request(app)
      .get("/api/admin/users")
      .set(bearer(token))
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const emails = response.body.map((row: { email: string }) => row.email);
    expect(emails).toEqual(
      expect.arrayContaining([
        "alice@local.lab",
        "bob@local.lab",
        "admin@local.lab",
      ]),
    );
    for (const row of response.body) {
      expect(row.passwordHash).toBeUndefined();
    }
  });
});
