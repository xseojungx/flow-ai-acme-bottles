import { purchaseOrderRepository } from "../repositories/purchase-order.repository";
import { AppError } from "../types/app-error";
import type { CreatePurchaseOrderInput, UpdatePurchaseOrderStatusInput } from "../dtos/purchase-order.dto";
import type { OrderStatus } from "../generated/prisma";

const VALID_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "IN_PRODUCTION",
  IN_PRODUCTION: "COMPLETED",
};

export const purchaseOrderService = {
  async create(input: CreatePurchaseOrderInput) {
    return purchaseOrderRepository.create(input);
  },

  async findAll() {
    // TODO: enrich with ETA fields from scheduling.service once implemented (step 2)
    return purchaseOrderRepository.findAll();
  },

  async updateStatus(id: string, input: UpdatePurchaseOrderStatusInput) {
    const order = await purchaseOrderRepository.findById(id);
    if (!order) throw new AppError(404, "Purchase order not found");

    const expectedNext = VALID_TRANSITIONS[order.status];
    if (expectedNext !== input.status) {
      throw new AppError(
        400,
        `Invalid transition: ${order.status} → ${input.status}`,
      );
    }

    const completed_at = input.status === "COMPLETED" ? new Date() : undefined;
    return purchaseOrderRepository.updateStatus(id, input.status as OrderStatus, completed_at);
  },
};
