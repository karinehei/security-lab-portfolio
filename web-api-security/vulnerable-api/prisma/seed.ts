import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fictional lab accounts only. These values are documented in the module README
 * and must never be copied from (or into) a real environment.
 */
const LAB_PASSWORD = "LabPassw0rd!";

const USERS: Array<{ email: string; role: Role }> = [
  { email: "alice@local.lab", role: Role.USER },
  { email: "bob@local.lab", role: Role.USER },
  { email: "admin@local.lab", role: Role.ADMIN },
];

async function seed(): Promise<void> {
  const passwordHash = await bcrypt.hash(LAB_PASSWORD, 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@local.lab" },
    update: { passwordHash, role: Role.USER },
    create: { email: "alice@local.lab", passwordHash, role: Role.USER },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@local.lab" },
    update: { passwordHash, role: Role.USER },
    create: { email: "bob@local.lab", passwordHash, role: Role.USER },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@local.lab" },
    update: { passwordHash, role: Role.ADMIN },
    create: { email: "admin@local.lab", passwordHash, role: Role.ADMIN },
  });

  const existing = await prisma.document.count();
  if (existing === 0) {
    await prisma.document.createMany({
      data: [
        {
          title: "Alice — Q3 compensation discussion",
          content:
            "Confidential lab document owned by Alice. Used to demonstrate object-level authorization.",
          ownerId: alice.id,
        },
        {
          title: "Alice — team meeting notes",
          content: "Alice's ordinary meeting notes. Still not Bob's data.",
          ownerId: alice.id,
        },
        {
          title: "Bob — merger discussion draft",
          content:
            "Confidential lab document owned by Bob. A different user must not read this in secure mode.",
          ownerId: bob.id,
        },
        {
          title: "Bob — personal journal",
          content: "Bob's private notes for the local lab only.",
          ownerId: bob.id,
        },
        {
          title: "Admin — internal security policy",
          content: "Administrator-owned policy text for the local lab.",
          ownerId: admin.id,
        },
      ],
    });
  }

  console.log("Seed complete.");
  console.log("Lab users (password for all: LabPassw0rd!):");
  for (const user of USERS) {
    console.log(`  - ${user.email} (${user.role})`);
  }
}

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
