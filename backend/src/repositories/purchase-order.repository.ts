import { prisma } from "../db.config";
import type { OrderStatus } from "../generated/prisma";
import type { CreatePurchaseOrderInput } from "../dtos/purchase-order.dto";

export const purchaseOrderRepository = {
  create(data: CreatePurchaseOrderInput) {
    return prisma.purchaseOrder.create({ data });
  },

  findAll() {
    return prisma.purchaseOrder.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  findAllAsc() {
    return prisma.purchaseOrder.findMany({
      orderBy: { created_at: "asc" },
    });
  },

  findById(id: string) {
    return prisma.purchaseOrder.findUnique({ where: { id } });
  },

  updateStatus(id: string, status: OrderStatus, completed_at?: Date) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { status, ...(completed_at !== undefined ? { completed_at } : {}) },
    });
  },
};
