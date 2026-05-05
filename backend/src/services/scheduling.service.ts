import { purchaseOrderRepository } from "../repositories/purchase-order.repository.js";
import { supplyOrderRepository } from "../repositories/supply-order.repository.js";
import type { ProductType, MaterialType } from "../generated/prisma/enums.js";

type MaterialMap = { PET: number; PTA: number; EG: number };
export type FulfillmentStatus = "ON_TIME" | "DELAYED" | "UNABLE_TO_FULFILL";

type PurchaseOrderRow = Awaited<
  ReturnType<typeof purchaseOrderRepository.findAllAsc>
>[number];

export type ScheduledOrder = PurchaseOrderRow & {
  material_ready_at: Date;
  start_at: Date;
  eta: Date;
  fulfillment_status: FulfillmentStatus;
  days_late: number | null;
};

const CAPACITY: Record<ProductType, number> = { L1: 2000, G1: 1500 };

const MATERIAL_REQ: Record<ProductType, MaterialMap> = {
  L1: { PET: 20, PTA: 15, EG: 10 },
  G1: { PET: 65, PTA: 45, EG: 20 },
};

type IncomingEntry = { remaining: number; expected_arrival_at: Date };
type IncomingQueue = { PET: IncomingEntry[]; PTA: IncomingEntry[]; EG: IncomingEntry[] };

const MATERIALS: MaterialType[] = ["PET", "PTA", "EG"];

function getMaterialValue(map: MaterialMap, mat: MaterialType): number {
  if (mat === "PET") return map.PET;
  if (mat === "PTA") return map.PTA;
  return map.EG;
}

function setMaterialValue(map: MaterialMap, mat: MaterialType, value: number): void {
  if (mat === "PET") map.PET = value;
  else if (mat === "PTA") map.PTA = value;
  else map.EG = value;
}

function getQueue(q: IncomingQueue, mat: MaterialType): IncomingEntry[] {
  if (mat === "PET") return q.PET;
  if (mat === "PTA") return q.PTA;
  return q.EG;
}

function getCapacity(pt: ProductType): number {
  return pt === "L1" ? CAPACITY.L1 : CAPACITY.G1;
}

function getLineBusy(busy: { L1: Date; G1: Date }, pt: ProductType): Date {
  return pt === "L1" ? busy.L1 : busy.G1;
}

function setLineBusy(busy: { L1: Date; G1: Date }, pt: ProductType, date: Date): void {
  if (pt === "L1") busy.L1 = date;
  else busy.G1 = date;
}

type ConsumeResult =
  | { canFulfill: false }
  | { canFulfill: true; latestEta: Date };

function tryConsumeIncoming(
  deficit: MaterialMap,
  incoming: IncomingQueue,
): ConsumeResult {
  // Plan consumption without mutating, then apply only if fully coverable.
  const plan: Array<{ mat: MaterialType; idx: number; amount: number }> = [];
  let latestEta: Date | null = null;

  for (const mat of MATERIALS) {
    let remaining = getMaterialValue(deficit, mat);
    if (remaining <= 0) continue;

    const queue = getQueue(incoming, mat);
    for (let i = 0; i < queue.length; i++) {
      if (remaining <= 0) break;
      const entry = queue[i];
      if (!entry) continue;
      const consume = Math.min(entry.remaining, remaining);
      remaining -= consume;
      plan.push({ mat, idx: i, amount: consume });
      if (!latestEta || entry.expected_arrival_at > latestEta) {
        latestEta = entry.expected_arrival_at;
      }
    }

    if (remaining > 0) return { canFulfill: false };
  }

  // Apply the plan — only reached when all deficits are covered.
  for (const { mat, idx, amount } of plan) {
    const entry = getQueue(incoming, mat)[idx];
    if (entry) entry.remaining -= amount;
  }

  // latestEta is non-null here: at least one material had deficit > 0 (we
  // wouldn't call this function if available already covered everything).
  return { canFulfill: true, latestEta: latestEta! };
}

export const schedulingService = {
  async computeSchedule(): Promise<ScheduledOrder[]> {
    const now = new Date();

    // Pass `now` to both repo queries so the received/incoming boundary is
    // consistent with the `now` used throughout this scheduling run.
    const [allOrders, receivedSupplies, incomingSupplies] = await Promise.all([
      purchaseOrderRepository.findAllAsc(),
      supplyOrderRepository.findReceived(now),
      supplyOrderRepository.findIncoming(now),
    ]);

    const available: MaterialMap = { PET: 0, PTA: 0, EG: 0 };
    for (const s of receivedSupplies) {
      available[s.material_type] += s.quantity;
    }

    const incoming: IncomingQueue = { PET: [], PTA: [], EG: [] };
    for (const s of incomingSupplies) {
      getQueue(incoming, s.material_type).push({
        remaining: s.quantity,
        expected_arrival_at: s.expected_arrival_at,
      });
    }

    const lineBusyUntil = { L1: now, G1: now };
    const idealLineBusyUntil = { L1: now, G1: now };
    const result: ScheduledOrder[] = [];

    for (const order of allOrders) {
      const req = MATERIAL_REQ[order.product_type];
      const need: MaterialMap = {
        PET: order.quantity * req.PET,
        PTA: order.quantity * req.PTA,
        EG: order.quantity * req.EG,
      };

      const coveredByAvailable =
        available.PET >= need.PET &&
        available.PTA >= need.PTA &&
        available.EG >= need.EG;

      let material_ready_at: Date;
      let fulfillment_status: FulfillmentStatus;

      if (coveredByAvailable) {
        material_ready_at = now;
        fulfillment_status = "ON_TIME";
        available.PET -= need.PET;
        available.PTA -= need.PTA;
        available.EG -= need.EG;
      } else {
        const deficit: MaterialMap = {
          PET: Math.max(0, need.PET - available.PET),
          PTA: Math.max(0, need.PTA - available.PTA),
          EG: Math.max(0, need.EG - available.EG),
        };

        const outcome = tryConsumeIncoming(deficit, incoming);

        if (!outcome.canFulfill) {
          for (const mat of MATERIALS) {
            const avail = getMaterialValue(available, mat);
            const n = getMaterialValue(need, mat);
            setMaterialValue(available, mat, avail - Math.min(avail, n));
          }
          result.push({
            ...order,
            material_ready_at: now,
            start_at: now,
            eta: now,
            fulfillment_status: "UNABLE_TO_FULFILL",
            days_late: null,
          });
          continue;
        }

        material_ready_at = outcome.latestEta;
        fulfillment_status = "DELAYED";
        // logic.md §6 step 7 says `available -= need` (can go negative).
        // Clamping to 0 instead: allowing negatives inflates subsequent orders'
        // deficits, causing them to over-consume from the incoming queue and
        // produce incorrect ETAs.
        available.PET -= Math.min(available.PET, need.PET);
        available.PTA -= Math.min(available.PTA, need.PTA);
        available.EG -= Math.min(available.EG, need.EG);
      }

      const lineBusy = getLineBusy(lineBusyUntil, order.product_type);
      const start_at = material_ready_at > lineBusy ? material_ready_at : lineBusy;
      const durationMs =
        (order.quantity / getCapacity(order.product_type)) * 60 * 60 * 1000;
      const eta = new Date(start_at.getTime() + durationMs);

      setLineBusy(lineBusyUntil, order.product_type, eta);

      // Compute ideal ETA (material always ready at `now`) to derive days_late.
      const idealLineBusy = getLineBusy(idealLineBusyUntil, order.product_type);
      const idealStart = idealLineBusy > now ? idealLineBusy : now;
      const idealEta = new Date(idealStart.getTime() + durationMs);
      setLineBusy(idealLineBusyUntil, order.product_type, idealEta);

      const days_late =
        fulfillment_status === "DELAYED"
          ? Math.max(0, Math.ceil((eta.getTime() - idealEta.getTime()) / (24 * 60 * 60 * 1000)))
          : null;

      result.push({ ...order, material_ready_at, start_at, eta, fulfillment_status, days_late });
    }

    return result;
  },
};
