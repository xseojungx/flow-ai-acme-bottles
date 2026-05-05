import express from "express";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { supplyOrderRouter } from "./routes/supply-order.routes.js";
import { purchaseOrderRouter } from "./routes/purchase-order.routes.js";
import { productionRouter } from "./routes/production.routes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

export const app = express();
app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/supply-orders", supplyOrderRouter);
app.use("/api/purchase-orders", purchaseOrderRouter);
app.use("/api/production", productionRouter);

app.use(errorMiddleware);
