import { supplyOrderRepository } from "../repositories/supply-order.repository";
import { schedulingService } from "./scheduling.service";
import type { CreateSupplyOrderInput } from "../dtos/supply-order.dto";

function deriveStatus(expectedArrivalAt: Date): "RECEIVED" | "ORDERED" {
  return expectedArrivalAt <= new Date() ? "RECEIVED" : "ORDERED";
}

export const supplyOrderService = {
  async create(input: CreateSupplyOrderInput) {
    const order = await supplyOrderRepository.create(input);
    return { ...order, status: deriveStatus(order.expected_arrival_at) };
  },

  async findAll() {
    const orders = await supplyOrderRepository.findAll();
    return orders.map((order) => ({
      ...order,
      status: deriveStatus(order.expected_arrival_at),
    }));
  },

  async getSummary() {
    return schedulingService.computeAvailableMaterials();
  },
};
