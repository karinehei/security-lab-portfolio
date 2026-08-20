import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireCurrentUser } from "../middleware/requireAuth.js";
import {
  createDocument,
  listDocumentsFor,
  readDocument,
} from "../services/documentService.js";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(20_000),
});

export const documentsRouter = Router();

documentsRouter.use(requireAuth);

documentsRouter.get("/", async (req, res, next) => {
  try {
    const actor = requireCurrentUser(req);
    const documents = await listDocumentsFor(actor);
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

documentsRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "title and content are required" });
      return;
    }

    const actor = requireCurrentUser(req);
    const document = await createDocument(actor, parsed.data);
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
});

/**
 * Direct object reference. Authorization is decided in canReadDocument().
 * In LAB_MODE=vulnerable this is the IDOR / BOLA training surface.
 */
documentsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id ?? "", 10);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ error: "Invalid document id" });
      return;
    }

    const actor = requireCurrentUser(req);
    const document = await readDocument(actor, id);
    res.json(document);
  } catch (error) {
    next(error);
  }
});
