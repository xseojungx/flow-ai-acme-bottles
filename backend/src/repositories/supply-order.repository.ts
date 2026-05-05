import { prisma } from "../db.config";
import type { CreateSupplyOrderInput } from "../dtos/supply-order.dto";

export const supplyOrderRepository = {
  create(data: CreateSupplyOrderInput) {
    return prisma.supplyOrder.create({
      data: {
        material_type: data.material_type,
        quantity: data.quantity,
        supplier_name: data.supplier_name ?? null,
        tracking_number: data.tracking_number ?? null,
        expected_arrival_at: new Date(data.expected_arrival_at),
      },
    });
  },

  findAll() {
    return prisma.supplyOrder.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  findReceived() {
    return prisma.supplyOrder.findMany({
      where: { expected_arrival_at: { lte: new Date() } },
    });
  },

  findIncoming() {
    return prisma.supplyOrder.findMany({
      where: { expected_arrival_at: { gt: new Date() } },
      orderBy: { expected_arrival_at: "asc" },
    });
  },
};
