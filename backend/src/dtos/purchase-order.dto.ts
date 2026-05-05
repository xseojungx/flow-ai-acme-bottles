import { z } from "zod";

export const CreatePurchaseOrderSchema = z.object({
  customer_name: z.string().min(1),
  product_type: z.enum(["L1", "G1"]),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const UpdatePurchaseOrderStatusSchema = z.object({
  status: z.enum(["IN_PRODUCTION", "COMPLETED"]),
});

export type CreatePurchaseOrderInput = z.infer<typeof CreatePurchaseOrderSchema>;
export type UpdatePurchaseOrderStatusInput = z.infer<typeof UpdatePurchaseOrderStatusSchema>;
