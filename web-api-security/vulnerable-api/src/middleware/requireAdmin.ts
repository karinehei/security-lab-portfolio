import type { NextFunction, Request, Response } from "express";
import { requireCurrentUser } from "./requireAuth.js";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const user = requireCurrentUser(req);
  if (user.role !== "ADMIN") {
    res.status(403).json({ error: "Administrator role required" });
    return;
  }
  next();
}
