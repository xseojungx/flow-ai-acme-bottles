import { Router } from "express";
import { purchaseOrderController } from "../controllers/purchase-order.controller";

export const purchaseOrderRouter = Router();

purchaseOrderRouter.post("/", purchaseOrderController.create);
purchaseOrderRouter.get("/", purchaseOrderController.findAll);
purchaseOrderRouter.patch("/:id/status", purchaseOrderController.updateStatus);
