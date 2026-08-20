import request from "supertest";
import { describe, expect, it } from "vitest";
import {
  app,
  bearer,
  decodeAccessToken,
  login,
  mintExpiredLabToken,
} from "../helpers.js";

/**
 * Lab-integrity checks for WEB-002 (insufficient JWT expiration).
 * Skipped when LAB_MODE=secure.
 */
describe.skipIf(process.env.LAB_MODE !== "vulnerable")(
  "JWT session lab demonstration (LAB_MODE=vulnerable)",
  () => {
    it("issues an access token with no exp claim and no expiresInSeconds", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "alice@local.lab", password: "LabPassw0rd!" })
        .expect(200);

      expect(response.body.expiresInSeconds).toBeNull();

      const payload = decodeAccessToken(response.body.token);
      expect(payload.exp).toBeUndefined();
    });

    it("accepts an already-expired access token for the same user", async () => {
      const token = await login("alice@local.lab");
      const me = await request(app).get("/api/me").set(bearer(token)).expect(200);

      const expired = mintExpiredLabToken({
        id: me.body.id,
        email: me.body.email,
        role: me.body.role,
      });

      const stillValid = await request(app)
        .get("/api/me")
        .set(bearer(expired))
        .expect(200);

      expect(stillValid.body.email).toBe("alice@local.lab");
    });
  },
);
