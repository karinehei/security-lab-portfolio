import { Router } from "express";
import { getLabMode } from "../config.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    labMode: getLabMode(),
    notice:
      "Local security training API. Do not expose this service outside localhost.",
  });
});
