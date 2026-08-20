import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { config } from "../../src/config.js";
import {
  app,
  bearer,
  decodeAccessToken,
  login,
  mintExpiredLabToken,
} from "../helpers.js";

describe.skipIf(process.env.LAB_MODE === "vulnerable")(
  "JWT session controls (LAB_MODE=secure)",
  () => {
    it("issues a short-lived HS256 token with an exp claim", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "alice@local.lab", password: "LabPassw0rd!" })
        .expect(200);

      expect(response.body.expiresInSeconds).toBe(config.jwtExpiresInSeconds);

      const payload = decodeAccessToken(response.body.token);
      const now = Math.floor(Date.now() / 1000);
      expect(payload.exp).toBeTypeOf("number");
      expect(payload.exp).toBeGreaterThan(now);
      expect(payload.exp).toBeLessThanOrEqual(now + config.jwtExpiresInSeconds + 5);

      const complete = jwt.decode(response.body.token, { complete: true });
      expect(complete?.header.alg).toBe("HS256");
    });

    it("rejects an expired access token", async () => {
      const token = await login("alice@local.lab");
      const me = await request(app).get("/api/me").set(bearer(token)).expect(200);

      const expired = mintExpiredLabToken({
        id: me.body.id,
        email: me.body.email,
        role: me.body.role,
      });

      await request(app).get("/api/me").set(bearer(expired)).expect(401);
    });

    it("still hashes and verifies passwords with bcrypt (wrong password is 401)", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({ email: "alice@local.lab", password: "not-the-lab-password" })
        .expect(401);
    });
  },
);
