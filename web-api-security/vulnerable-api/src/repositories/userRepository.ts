import { prisma } from "../db.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  listDirectory() {
    return prisma.user.findMany({
      select: { id: true, email: true, role: true },
      orderBy: { id: "asc" },
    });
  },
};
