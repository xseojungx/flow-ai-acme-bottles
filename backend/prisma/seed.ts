import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Material requirements (g/bottle) ───
// L1: PET=20 PTA=15 EG=10
// G1: PET=65 PTA=45 EG=20
//
// ─── Supply design ─────────────────────
// RECEIVED (arrived ≤ 2026-05-05):
//   PET  900,000g — sufficient for all orders
//   PTA  500,000g — sufficient for all orders
//   EG   200,000g — insufficient (runs out after PENDING L1)
//
// ORDERED (arriving 2026-05-10):
//   EG   120,000g — covers the 60,000g EG deficit for PENDING G1 → DELAYED
//
// ─── FIFO trace ────────────────────────
// Initial available: PET=900k PTA=500k EG=200k
//
// COMPLETED L1 2000 → need PET=40k PTA=30k EG=20k → PET=860k PTA=470k EG=180k
// COMPLETED G1 1000 → need PET=65k PTA=45k EG=20k → PET=795k PTA=425k EG=160k
// COMPLETED L1 3000 → need PET=60k PTA=45k EG=30k → PET=735k PTA=380k EG=130k
// IN_PROD  L1 5000 → need PET=100k PTA=75k EG=50k → PET=635k PTA=305k EG=80k  (ON_TIME)
// IN_PROD  G1 2000 → need PET=130k PTA=90k EG=40k → PET=505k PTA=215k EG=40k  (ON_TIME)
// PENDING  L1 4000 → need PET=80k PTA=60k EG=40k  → PET=425k PTA=155k EG=0    (ON_TIME, EG exactly 0)
// PENDING  G1 3000 → need PET=195k PTA=135k EG=60k → EG deficit 60k            (DELAYED via 5/10 supply)

async function main() {
  await prisma.purchaseOrder.deleteMany();
  await prisma.supplyOrder.deleteMany();

  // ── Supply Orders ──────────────────────────────────────────────────────────
  await prisma.supplyOrder.createMany({
    data: [
      {
        material_type: "PET",
        quantity: 900_000,
        supplier_name: "Acme Chemicals",
        tracking_number: "TRK-2026-001",
        expected_arrival_at: new Date("2026-04-20T00:00:00.000Z"),
      },
      {
        material_type: "PTA",
        quantity: 500_000,
        supplier_name: "Global Polymers",
        tracking_number: "TRK-2026-002",
        expected_arrival_at: new Date("2026-04-25T00:00:00.000Z"),
      },
      {
        material_type: "EG",
        quantity: 200_000,
        supplier_name: "ChemSource Inc.",
        tracking_number: "TRK-2026-003",
        expected_arrival_at: new Date("2026-04-30T00:00:00.000Z"),
      },
      // Incoming supply — covers the EG shortfall for PENDING G1 order
      {
        material_type: "EG",
        quantity: 120_000,
        supplier_name: "ChemSource Inc.",
        tracking_number: "TRK-2026-004",
        expected_arrival_at: new Date("2026-05-10T00:00:00.000Z"),
      },
    ],
  });

  // ── Purchase Orders (inserted in FIFO created_at ASC order) ───────────────
  await prisma.purchaseOrder.createMany({
    data: [
      // ── 3× COMPLETED ──────────────────────────────────────────────────────
      {
        customer_name: "Samsung Water",
        product_type: "L1",
        quantity: 2_000,
        status: "COMPLETED",
        notes: null,
        created_at: new Date("2026-04-01T09:00:00.000Z"),
        completed_at: new Date("2026-04-02T10:00:00.000Z"),
      },
      {
        customer_name: "Lotte Beverage",
        product_type: "G1",
        quantity: 1_000,
        status: "COMPLETED",
        notes: null,
        created_at: new Date("2026-04-05T09:00:00.000Z"),
        completed_at: new Date("2026-04-07T09:40:00.000Z"),
      },
      {
        customer_name: "CJ Foods",
        product_type: "L1",
        quantity: 3_000,
        status: "COMPLETED",
        notes: null,
        created_at: new Date("2026-04-10T09:00:00.000Z"),
        completed_at: new Date("2026-04-11T10:30:00.000Z"),
      },
      // ── 1× IN_PRODUCTION per line ──────────────────────────────────────────
      {
        customer_name: "Coca-Cola Korea",
        product_type: "L1",
        quantity: 5_000,
        status: "IN_PRODUCTION",
        notes: null,
        created_at: new Date("2026-04-20T09:00:00.000Z"),
        completed_at: null,
      },
      {
        customer_name: "Pepsi Korea",
        product_type: "G1",
        quantity: 2_000,
        status: "IN_PRODUCTION",
        notes: null,
        created_at: new Date("2026-04-22T09:00:00.000Z"),
        completed_at: null,
      },
      // ── 2× PENDING ────────────────────────────────────────────────────────
      // L1: ON_TIME (EG exactly used up — no deficit yet)
      {
        customer_name: "Nestlé Waters",
        product_type: "L1",
        quantity: 4_000,
        status: "PENDING",
        notes: "Delivery requested by June 2026",
        created_at: new Date("2026-05-01T09:00:00.000Z"),
        completed_at: null,
      },
      // G1: DELAYED — EG runs out; covered by the 2026-05-10 incoming supply
      {
        customer_name: "Evian Corp",
        product_type: "G1",
        quantity: 3_000,
        status: "PENDING",
        notes: null,
        created_at: new Date("2026-05-03T09:00:00.000Z"),
        completed_at: null,
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Supply summary (received − consumed_by_COMPLETED):");
  console.log("  PET available: 900,000 − 165,000 = 735,000 g  ✓ sufficient");
  console.log("  PTA available: 500,000 − 120,000 = 380,000 g  ✓ sufficient");
  console.log("  EG  available: 200,000 −  70,000 = 130,000 g  ⚠ running low");
  console.log(
    "Scheduling: PENDING G1 (Evian) → DELAYED (EG covered by 2026-05-10 supply)",
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
