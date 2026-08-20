import request from "supertest";
import { describe, expect, it } from "vitest";
import { getLabMode } from "../../src/config.js";
import { app, bearer, login } from "../helpers.js";

describe("GET /health and authentication", () => {
  it("reports process health and current lab mode", async () => {
    const response = await request(app).get("/health").expect(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.labMode).toBe(getLabMode());
  });

  it("returns HTML from /health when the client is a browser", async () => {
    const response = await request(app)
      .get("/health")
      .set("Accept", "text/html")
      .expect(200);
    expect(response.text).toContain("vulnerable-api health");
    expect(response.text).toContain(getLabMode());
  });

  it("describes the API at GET / so a browser is not a 404", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.body.health).toBe("/health");
    expect(response.body.labMode).toBe(getLabMode());
  });

  it("issues a token for a seeded lab user", async () => {
    const token = await login("alice@local.lab");
    const me = await request(app)
      .get("/api/me")
      .set(bearer(token))
      .expect(200);

    expect(me.body.email).toBe("alice@local.lab");
    expect(me.body.role).toBe("USER");
    expect(me.body.passwordHash).toBeUndefined();
  });

  it("rejects invalid lab credentials", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@local.lab", password: "wrong-password" })
      .expect(401);
  });

  it("rejects document access without a token", async () => {
    await request(app).get("/api/documents").expect(401);
  });
});
