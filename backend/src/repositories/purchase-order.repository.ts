import { prisma } from "../db.config";
import type { OrderStatus } from "../generated/prisma/enums.js";
import type { CreatePurchaseOrderInput } from "../dtos/purchase-order.dto";

export const purchaseOrderRepository = {
  create(data: CreatePurchaseOrderInput) {
    return prisma.purchaseOrder.create({
      data: {
        customer_name: data.customer_name,
        product_type: data.product_type,
        quantity: data.quantity,
        notes: data.notes ?? null,
      },
    });
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
