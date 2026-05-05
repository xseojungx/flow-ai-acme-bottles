import type { Request, Response, NextFunction } from "express";
import { productionService } from "../services/production.service.js";

export const productionController = {
  async getStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const status = await productionService.getStatus();
      res.json({ message: "Production status fetched", data: status });
    } catch (err) {
      next(err);
    }
  },
};
