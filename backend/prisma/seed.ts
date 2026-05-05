import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.supplyOrder.createMany({
    data: [
      {
        material_type: "PET",
        quantity: 5000,
        supplier_name: "Acme Chemicals",
        tracking_number: "TRK-2026-001",
        expected_arrival_at: new Date("2026-04-20"),
      },
      {
        material_type: "PTA",
        quantity: 3000,
        supplier_name: "Global Polymers",
        tracking_number: "TRK-2026-002",
        expected_arrival_at: new Date("2026-05-10"),
      },
      {
        material_type: "EG",
        quantity: 2000,
        supplier_name: "ChemSource Inc.",
        tracking_number: "TRK-2026-003",
        expected_arrival_at: new Date("2026-05-01"),
      },
      {
        material_type: "PET",
        quantity: 8000,
        supplier_name: "Acme Chemicals",
        expected_arrival_at: new Date("2026-05-25"),
      },
      {
        material_type: "PTA",
        quantity: 4500,
        supplier_name: "Pacific Resins",
        tracking_number: "TRK-2026-005",
        expected_arrival_at: new Date("2026-06-01"),
      },
    ],
  });

  await prisma.purchaseOrder.createMany({
    data: [
      {
        customer_name: "Coca-Cola Bottling",
        product_type: "L1",
        quantity: 10000,
        status: "COMPLETED",
        notes: "Rush order",
        completed_at: new Date("2026-04-15"),
      },
      {
        customer_name: "Pepsi Distributors",
        product_type: "G1",
        quantity: 5000,
        status: "IN_PRODUCTION",
        notes: null,
        completed_at: null,
      },
      {
        customer_name: "NestleWaters",
        product_type: "L1",
        quantity: 7500,
        status: "PENDING",
        notes: "Delivery by June 2026",
        completed_at: null,
      },
      {
        customer_name: "Evian Corp",
        product_type: "G1",
        quantity: 3000,
        status: "PENDING",
        notes: null,
        completed_at: null,
      },
      {
        customer_name: "Dasani Supply",
        product_type: "L1",
        quantity: 6000,
        status: "IN_PRODUCTION",
        notes: "Second batch",
        completed_at: null,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
