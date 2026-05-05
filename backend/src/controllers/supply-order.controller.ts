import type { Request, Response, NextFunction } from "express";
import { CreateSupplyOrderSchema } from "../dtos/supply-order.dto";
import { supplyOrderService } from "../services/supply-order.service";

export const supplyOrderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = CreateSupplyOrderSchema.parse(req.body);
      const order = await supplyOrderService.create(input);
      res.status(201).json({ message: "Supply order created", data: order });
    } catch (err) {
      next(err);
    }
  },

  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await supplyOrderService.findAll();
      res.json({
        message: "Supply orders fetched",
        data: { items: orders, total: orders.length },
      });
    } catch (err) {
      next(err);
    }
  },
};
