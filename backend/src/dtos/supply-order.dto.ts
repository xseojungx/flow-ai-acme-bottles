import { z } from "zod";

export const CreateSupplyOrderSchema = z.object({
  material_type: z.enum(["PET", "PTA", "EG"]),
  quantity: z.number().int().positive(),
  supplier_name: z.string().optional(),
  tracking_number: z.string().optional(),
  expected_arrival_at: z.iso.datetime(),
});

export type CreateSupplyOrderInput = z.infer<typeof CreateSupplyOrderSchema>;
