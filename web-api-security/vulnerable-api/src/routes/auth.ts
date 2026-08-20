import { Router } from "express";
import { z } from "zod";
import { AuthError, authenticate } from "../services/authService.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const { token, user, expiresInSeconds } = await authenticate(
      parsed.data.email,
      parsed.data.password,
    );
    res.json({ token, user, expiresInSeconds });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    next(error);
  }
});
