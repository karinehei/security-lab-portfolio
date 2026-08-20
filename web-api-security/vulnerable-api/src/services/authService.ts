import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config, isVulnerableMode } from "../config.js";
import { userRepository } from "../repositories/userRepository.js";
import type { AuthenticatedUser } from "../types.js";

export class AuthError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "AuthError";
  }
}

type AccessTokenClaims = {
  sub: string;
  email: string;
  role: AuthenticatedUser["role"];
};

export type LoginResult = {
  token: string;
  user: AuthenticatedUser;
  expiresInSeconds: number | null;
};

/**
 * Password handling is the same in both lab modes: bcrypt hash at rest,
 * bcrypt.compare on login, generic "Invalid credentials" on failure.
 * WEB-002 is a session-lifetime defect, not a hashing defect.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<LoginResult> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AuthError();
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new AuthError();
  }

  const actor: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const claims = {
    sub: String(actor.id),
    email: actor.email,
    role: actor.role,
  } satisfies AccessTokenClaims;

  const token = isVulnerableMode()
    ? signVulnerableAccessToken(claims)
    : signSecureAccessToken(claims);

  return {
    token,
    user: actor,
    expiresInSeconds: isVulnerableMode() ? null : config.jwtExpiresInSeconds,
  };
}

/**
 * LAB VULNERABILITY (WEB-002): Insufficient session expiration (CWE-613).
 * The token is still HMAC-signed, but it carries no exp claim. A captured
 * Bearer token remains valid until the signing secret is rotated.
 */
function signVulnerableAccessToken(claims: AccessTokenClaims): string {
  return jwt.sign(claims, config.jwtSecret, {
    algorithm: "HS256",
  });
}

function signSecureAccessToken(claims: AccessTokenClaims): string {
  return jwt.sign(claims, config.jwtSecret, {
    algorithm: "HS256",
    expiresIn: config.jwtExpiresInSeconds,
  });
}

export function verifyAccessToken(token: string): AuthenticatedUser {
  const decoded = isVulnerableMode()
    ? verifyVulnerableAccessToken(token)
    : verifySecureAccessToken(token);

  const id = Number.parseInt(String(decoded.sub), 10);
  const email = decoded.email;
  const role = decoded.role;

  if (
    !Number.isInteger(id) ||
    id < 1 ||
    typeof email !== "string" ||
    (role !== "USER" && role !== "ADMIN")
  ) {
    throw new AuthError("Invalid token");
  }

  return { id, email, role };
}

function verifyVulnerableAccessToken(token: string): jwt.JwtPayload {
  // LAB VULNERABILITY (WEB-002): ignoreExpiration accepts expired tokens and
  // tokens that were issued with no exp claim. Do not copy this option into
  // production code. Gated by LAB_MODE=vulnerable (see assertLabSafety).
  const decoded = jwt.verify(token, config.jwtSecret, {
    algorithms: ["HS256"],
    ignoreExpiration: true,
  });
  if (typeof decoded === "string") {
    throw new AuthError("Invalid token");
  }
  return decoded;
}

function verifySecureAccessToken(token: string): jwt.JwtPayload {
  const decoded = jwt.verify(token, config.jwtSecret, {
    algorithms: ["HS256"],
    clockTolerance: 0,
    ignoreExpiration: false,
  });
  if (typeof decoded === "string") {
    throw new AuthError("Invalid token");
  }
  if (typeof decoded.exp !== "number") {
    throw new AuthError("Invalid token");
  }
  return decoded;
}

export async function getProfile(id: number): Promise<AuthenticatedUser | null> {
  const user = await userRepository.findById(id);
  if (!user) {
    return null;
  }
  return { id: user.id, email: user.email, role: user.role };
}
