import type { Request, Response } from "express";

/** Browsers send text/html; curl and tests typically do not. */
export function wantsHtml(req: Request): boolean {
  return String(req.headers.accept ?? "").includes("text/html");
}

export function sendJsonOrHtml(
  req: Request,
  res: Response,
  payload: Record<string, unknown>,
  title: string,
): void {
  if (!wantsHtml(req)) {
    res.json(payload);
    return;
  }

  const json = JSON.stringify(payload, null, 2);
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:2rem;line-height:1.4">
<h1>${title}</h1>
<p>This is a REST training API, not a website. JSON for curl/tests; this page is for browsers.</p>
<pre style="background:#f4f4f4;padding:1rem;overflow:auto">${json.replace(/</g, "&lt;")}</pre>
<p><a href="/health">/health</a> · login is <code>POST /api/auth/login</code></p>
</body>
</html>`);
}
