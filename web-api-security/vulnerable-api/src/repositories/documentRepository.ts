import { prisma } from "../db.js";

export const documentRepository = {
  findById(id: number) {
    return prisma.document.findUnique({ where: { id } });
  },

  findByOwner(ownerId: number) {
    return prisma.document.findMany({
      where: { ownerId },
      orderBy: { id: "asc" },
    });
  },

  findAll() {
    return prisma.document.findMany({ orderBy: { id: "asc" } });
  },

  create(data: { title: string; content: string; ownerId: number }) {
    return prisma.document.create({ data });
  },
};
