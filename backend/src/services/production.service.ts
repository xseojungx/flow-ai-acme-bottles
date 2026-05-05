import { schedulingService } from "./scheduling.service.js";
import type { ProductType } from "../generated/prisma/enums.js";

export const productionService = {
  async getStatus() {
    // computeSchedule returns all orders in FIFO (created_at ASC) order.
    const scheduled = await schedulingService.computeSchedule();

    const byLine = (pt: ProductType) => {
      const active = scheduled.filter(
        (o) => o.product_type === pt && o.status !== "COMPLETED",
      );
      return {
        in_production: active.find((o) => o.status === "IN_PRODUCTION") ?? null,
        queue: active.filter((o) => o.status === "PENDING"),
      };
    };

    return { L1: byLine("L1"), G1: byLine("G1") };
  },
};
