import { Router } from "express";
import { supplyOrderController } from "../controllers/supply-order.controller";

export const supplyOrderRouter = Router();

supplyOrderRouter.post("/", supplyOrderController.create);
supplyOrderRouter.get("/", supplyOrderController.findAll);
