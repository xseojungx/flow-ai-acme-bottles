import type { Request, Response, NextFunction } from "express";
import { CreatePurchaseOrderSchema, UpdatePurchaseOrderStatusSchema } from "../dtos/purchase-order.dto";
import { purchaseOrderService } from "../services/purchase-order.service";

export const purchaseOrderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = CreatePurchaseOrderSchema.parse(req.body);
      const order = await purchaseOrderService.create(input);
      res.status(201).json({ message: "Purchase order created", data: order });
    } catch (err) {
      next(err);
    }
  },

  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await purchaseOrderService.findAll();
      res.json({
        message: "Purchase orders fetched",
        data: { items: orders, total: orders.length },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = UpdatePurchaseOrderStatusSchema.parse(req.body);
      const order = await purchaseOrderService.updateStatus(id, input);
      res.json({ message: "Purchase order status updated", data: order });
    } catch (err) {
      next(err);
    }
  },
};
