import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/authService.js";
import type { AuthenticatedUser } from "../types.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.header("authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = header.slice("bearer ".length).trim();
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireCurrentUser(req: Request): AuthenticatedUser {
  if (!req.user) {
    throw new Error("requireAuth must run before requireCurrentUser");
  }
  return req.user;
}
