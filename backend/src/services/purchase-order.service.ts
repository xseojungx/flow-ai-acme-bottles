import { purchaseOrderRepository } from "../repositories/purchase-order.repository";
import { schedulingService } from "./scheduling.service";
import { AppError } from "../types/app-error";
import type { CreatePurchaseOrderInput, UpdatePurchaseOrderStatusInput } from "../dtos/purchase-order.dto";
import type { OrderStatus } from "../generated/prisma/enums.js";

const VALID_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "IN_PRODUCTION",
  IN_PRODUCTION: "COMPLETED",
};

export const purchaseOrderService = {
  async create(input: CreatePurchaseOrderInput) {
    return purchaseOrderRepository.create(input);
  },

  async findAll() {
    const scheduled = await schedulingService.computeSchedule();
    return [...scheduled].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    );
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
