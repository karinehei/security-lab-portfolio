import { assertLabSafety, getLabMode } from "./config.js";
import { ask } from "./pipeline.js";
import { ACTORS, seedDocuments } from "./seed.js";

assertLabSafety();

function arg(name: string, fallback: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  return value ?? fallback;
}

const userKey = arg("--user", "alice");
const query = arg("--query", "merger");

if (!(userKey in ACTORS)) {
  console.error(`Unknown --user ${userKey}. Use alice, bob, or admin.`);
  process.exitCode = 1;
} else {
  const actor = ACTORS[userKey as keyof typeof ACTORS];
  const result = ask({
    actor,
    documents: seedDocuments(),
    query,
  });

  console.log(
    JSON.stringify(
      {
        labMode: getLabMode(),
        actor: actor.email,
        query,
        retrievedDocumentIds: result.audit.retrievedDocumentIds,
        answer: result.answer,
      },
      null,
      2,
    ),
  );
}
