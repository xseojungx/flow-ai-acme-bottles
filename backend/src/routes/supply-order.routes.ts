import { Router } from "express";
import { supplyOrderController } from "../controllers/supply-order.controller";

export const supplyOrderRouter = Router();

supplyOrderRouter.get("/summary", supplyOrderController.getSummary);
supplyOrderRouter.get("/", supplyOrderController.findAll);
supplyOrderRouter.post("/", supplyOrderController.create);
