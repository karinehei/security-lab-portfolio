import { assertLabSafety, config, getLabMode } from "./config.js";
import { createApp } from "./app.js";
import { prisma } from "./db.js";

assertLabSafety();

const app = createApp();
const mode = getLabMode();

if (mode === "vulnerable") {
  console.warn("--------------------------------------------------");
  console.warn("[security-lab] LAB_MODE=vulnerable");
  console.warn("Intentionally insecure. Local training only.");
  console.warn("Do not expose this process on a public interface.");
  console.warn("--------------------------------------------------");
} else {
  console.log("[security-lab] LAB_MODE=secure");
}

const server = app.listen(config.port, config.listenHost, () => {
  console.log(`Listening on http://${config.listenHost}:${config.port}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await prisma.$disconnect();
}

process.on("SIGINT", () => {
  void shutdown().then(() => process.exit(0));
});
process.on("SIGTERM", () => {
  void shutdown().then(() => process.exit(0));
});
