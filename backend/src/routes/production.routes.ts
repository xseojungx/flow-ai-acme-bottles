import { Router } from "express";
import { productionController } from "../controllers/production.controller.js";

export const productionRouter = Router();

productionRouter.get("/status", productionController.getStatus);
