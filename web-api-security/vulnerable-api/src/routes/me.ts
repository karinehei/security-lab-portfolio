import { Router } from "express";
import { requireAuth, requireCurrentUser } from "../middleware/requireAuth.js";
import { getProfile } from "../services/authService.js";

export const meRouter = Router();

meRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const actor = requireCurrentUser(req);
    const profile = await getProfile(actor.id);
    if (!profile) {
      res.status(401).json({ error: "User no longer exists" });
      return;
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
});
