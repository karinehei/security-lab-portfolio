import type { Actor } from "./types.js";

export const ACTORS = {
  alice: {
    id: "user-alice",
    email: "alice@local.lab",
    role: "USER",
  },
  bob: {
    id: "user-bob",
    email: "bob@local.lab",
    role: "USER",
  },
  admin: {
    id: "user-admin",
    email: "admin@local.lab",
    role: "ADMIN",
  },
} as const satisfies { alice: Actor; bob: Actor; admin: Actor };

/** Distinctive markers so tests can see whether another user's text entered the prompt. */
export const MARKER_ALICE_PRIVATE = "MARKER_ALICE_PRIVATE_COMPENSATION";
export const MARKER_BOB_PRIVATE = "MARKER_BOB_PRIVATE_MERGER";

export function seedDocuments() {
  return [
    {
      id: "doc-alice-comp",
      ownerId: ACTORS.alice.id,
      title: "Alice compensation notes",
      content: `Confidential lab record for Alice only. ${MARKER_ALICE_PRIVATE}. Not for other tenants.`,
    },
    {
      id: "doc-alice-lunch",
      ownerId: ACTORS.alice.id,
      title: "Alice lunch notes",
      content: "Alice is considering a salad. Harmless personal note.",
    },
    {
      id: "doc-bob-merger",
      ownerId: ACTORS.bob.id,
      title: "Bob merger discussion",
      content: `Confidential lab record for Bob only. ${MARKER_BOB_PRIVATE}. Cross-user retrieval must not return this in secure mode.`,
    },
    {
      id: "doc-bob-journal",
      ownerId: ACTORS.bob.id,
      title: "Bob personal journal",
      content: "Bob's private journal text for the local RAG lab.",
    },
  ];
}
