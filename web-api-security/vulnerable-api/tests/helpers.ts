import jwt from "jsonwebtoken";
import request from "supertest";
import { createApp } from "../src/app.js";
import { config } from "../src/config.js";

export const app = createApp();

export const LAB_PASSWORD = "LabPassw0rd!";

export async function login(email: string): Promise<string> {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email, password: LAB_PASSWORD })
    .expect(200);

  return response.body.token as string;
}

export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

export function decodeAccessToken(token: string): jwt.JwtPayload {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string") {
    throw new Error("Login response did not contain a JWT");
  }
  return decoded;
}

/**
 * Builds a lab JWT that is already expired. Uses the local JWT_SECRET so tests
 * can exercise expiration handling without calling any external service.
 */
export function mintExpiredLabToken(user: {
  id: number;
  email: string;
  role: string;
}): string {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) - 120,
    },
    config.jwtSecret,
    { algorithm: "HS256" },
  );
}
