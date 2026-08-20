import { Router } from "express";
import { getLabMode } from "../config.js";
import { sendJsonOrHtml } from "../http/jsonOrHtml.js";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  sendJsonOrHtml(
    req,
    res,
    {
      status: "ok",
      labMode: getLabMode(),
      notice:
        "Local security training API. Do not expose this service outside localhost.",
    },
    "vulnerable-api health",
  );
});
