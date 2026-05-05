# ACME Bottles — Backend Logic & Design Specification

> This document captures all confirmed decisions from the design session.
> Use this as the single source of truth when implementing the backend.

---

## 1. Tech Stack

- Runtime: **Node.js**
- Database: **TBD** (SQLite or PostgreSQL — not yet confirmed)

---

## 2. Database Schema

### Table: `purchase_orders`

| Column        | Type                                          | Constraints              |
| ------------- | --------------------------------------------- | ------------------------ |
| id            | UUID                                          | PK                       |
| customer_name | VARCHAR                                       | NOT NULL                 |
| product_type  | ENUM(`1L`, `1G`)                              | NOT NULL                 |
| quantity      | INTEGER                                       | NOT NULL — unit: bottles |
| status        | ENUM(`PENDING`, `IN_PRODUCTION`, `COMPLETED`) | NOT NULL                 |
| notes         | TEXT                                          | NULLABLE                 |
| created_at    | TIMESTAMP                                     | NOT NULL                 |
| completed_at  | TIMESTAMP                                     | NULLABLE                 |

### Table: `supply_orders`

| Column              | Type                     | Constraints            |
| ------------------- | ------------------------ | ---------------------- |
| id                  | UUID                     | PK                     |
| material_type       | ENUM(`PET`, `PTA`, `EG`) | NOT NULL               |
| quantity            | INTEGER                  | NOT NULL — unit: grams |
| supplier_name       | VARCHAR                  | NULLABLE               |
| tracking_number     | VARCHAR                  | NULLABLE               |
| expected_arrival_at | TIMESTAMP                | NOT NULL               |
| created_at          | TIMESTAMP                | NOT NULL               |

> ⚠️ `supply_orders` has **no `status` column**.
> Supply status is derived at runtime: `expected_arrival_at <= NOW()` → `RECEIVED`, otherwise → `ORDERED`.

---

## 3. Business Rules

### Products & Production Lines

| Line    | Product        | Capacity           |
| ------- | -------------- | ------------------ |
| 1L Line | 1L Bottle only | 2,000 bottles/hour |
| 1G Line | 1G Bottle only | 1,500 bottles/hour |

- Lines run **24 hours/day**, no downtime, no delays, always at full capacity
- Lines operate **independently**
- Each line only produces its designated product

### Material Requirements Per Unit

| Material | 1L Bottle | 1G Bottle |
| -------- | --------- | --------- |
| PET      | 20g       | 65g       |
| PTA      | 15g       | 45g       |
| EG       | 10g       | 20g       |

---

## 4. Derived / Runtime-Only Values

These values are **never stored in the database**. They are calculated fresh on every read.

| Value                                | Calculated On                                               |
| ------------------------------------ | ----------------------------------------------------------- |
| `supply_orders.status`               | `expected_arrival_at <= NOW()` → `RECEIVED`, else `ORDERED` |
| `purchase_orders.material_ready_at`  | See ETA algorithm below                                     |
| `purchase_orders.start_at`           | See ETA algorithm below                                     |
| `purchase_orders.eta`                | See ETA algorithm below                                     |
| `purchase_orders.fulfillment_status` | `ON_TIME` / `DELAYED` / `UNABLE_TO_FULFILL`                 |

---

## 5. Inventory Calculation Rule

```
initial_available[PET] = SUM(quantity) WHERE expected_arrival_at <= NOW() AND material_type = 'PET'
initial_available[PTA] = SUM(quantity) WHERE expected_arrival_at <= NOW() AND material_type = 'PTA'
initial_available[EG]  = SUM(quantity) WHERE expected_arrival_at <= NOW() AND material_type = 'EG'
```

- **No separate inventory table exists.**
- Inventory is derived solely from `supply_orders`.
- Deduction happens **only inside the FIFO loop** (see Section 6).
- ❌ Do NOT pre-deduct COMPLETED or IN_PRODUCTION orders before the loop — this causes double-deduction.

---

## 6. ETA Calculation Algorithm (FIFO)

### Setup

```
available = initial_available (from Section 5)

incoming_supplies = supply_orders
  WHERE expected_arrival_at > NOW()
  ORDER BY expected_arrival_at ASC
  (grouped by material_type)

line_busy_until = {
  '1L': NOW(),
  '1G': NOW()
}

all_orders = purchase_orders
  ORDER BY created_at ASC   ← global FIFO, all statuses included
```

### Loop

```
for each order in all_orders:

  1. Calculate material need
     need = {
       PET: order.quantity × material_requirement[order.product_type].PET,
       PTA: order.quantity × material_requirement[order.product_type].PTA,
       EG:  order.quantity × material_requirement[order.product_type].EG
     }

  2. Determine material_ready_at
     if available >= need (all three materials):
       material_ready_at = NOW()
     else:
       deficit = need - available  (per material)
       consume from incoming_supplies in ETA order until deficit is covered
       material_ready_at = latest expected_arrival_at consumed
       if deficit cannot be fully covered:
         fulfillment_status = UNABLE_TO_FULFILL
         available -= min(available, need)   ← still deduct what's possible
         line_busy_until[product_type] unchanged
         continue to next order

  3. Calculate start_at
     start_at = max(material_ready_at, line_busy_until[order.product_type])

  4. Calculate production duration
     duration_hours = order.quantity / capacity[order.product_type]
     (1L → 2000/h, 1G → 1500/h)

  5. Calculate eta
     eta = start_at + duration_hours

  6. Determine fulfillment_status
     if material_ready_at <= NOW():  ON_TIME
     else:                           DELAYED

  7. Update state for next iteration
     available[PET] -= need.PET
     available[PTA] -= need.PTA
     available[EG]  -= need.EG
     line_busy_until[order.product_type] = eta
```

> ⚠️ The loop covers **all** orders regardless of status (`COMPLETED`, `IN_PRODUCTION`, `PENDING`).
> ETA output is only meaningful for `PENDING` and `IN_PRODUCTION` orders,
> but COMPLETED orders must still run through the loop to correctly deduct their material consumption.

---

## 7. fulfillment_status Values

| Value               | Condition                                                                               |
| ------------------- | --------------------------------------------------------------------------------------- |
| `ON_TIME`           | `material_ready_at <= NOW()` — sufficient stock available immediately                   |
| `DELAYED`           | `material_ready_at > NOW()` — insufficient current stock, but incoming supply can cover |
| `UNABLE_TO_FULFILL` | No combination of current + incoming supply can cover the need                          |

- `UNABLE_TO_FULFILL` orders are **accepted and stored**, not rejected.
- They remain in the queue and their status is surfaced via `fulfillment_status`.

---

## 8. Purchase Order Status Transitions

```
PENDING → IN_PRODUCTION → COMPLETED
```

- `PENDING → IN_PRODUCTION`: manual PATCH API
- `IN_PRODUCTION → COMPLETED`: manual PATCH API
- `completed_at` is set when status transitions to `COMPLETED`

---

## 9. API Endpoints

### Purchase Orders

| Method  | Path                              | Description                                                                  |
| ------- | --------------------------------- | ---------------------------------------------------------------------------- |
| `POST`  | `/api/purchase-orders`            | Create a new purchase order                                                  |
| `GET`   | `/api/purchase-orders`            | List all purchase orders, `created_at DESC`, ETA fields included (runtime)   |
| `PATCH` | `/api/purchase-orders/:id/status` | Manually advance status (`PENDING→IN_PRODUCTION`, `IN_PRODUCTION→COMPLETED`) |

### Supply Orders

| Method | Path                 | Description                                                            |
| ------ | -------------------- | ---------------------------------------------------------------------- |
| `POST` | `/api/supply-orders` | Create a new supply order                                              |
| `GET`  | `/api/supply-orders` | List all supply orders, `created_at DESC`, `status` included (runtime) |

### Production

| Method | Path                     | Description                                                            |
| ------ | ------------------------ | ---------------------------------------------------------------------- |
| `GET`  | `/api/production/status` | Per-line status + FIFO queue + ETA for all active orders (all runtime) |

---

## 10. Non-Goals (Do NOT implement)

- Authentication / Authorization
- Pricing or cost logic
- Shipping or logistics
- Separate inventory table
- Multi-user concurrency handling
- Optimization algorithms
- Auto-status transitions via cron jobs or timers

---

## 11. Key Implementation Notes

1. **Never store ETA, start_at, material_ready_at, or fulfillment_status in the database.**
   These must always be recalculated on read.

2. **Never store supply status in the database.**
   Always derive from `expected_arrival_at <= NOW()`.

3. **FIFO loop must start from the very first order (oldest `created_at`)**, not just PENDING orders.
   Skipping COMPLETED/IN_PRODUCTION breaks inventory deduction accuracy.

4. **Inventory deduction happens only inside the FIFO loop.**
   Do not pre-deduct anywhere else. Double-deduction is a confirmed risk if you do.

5. **Both production lines share the same material inventory.**
   The FIFO loop handles contention naturally via `created_at` ordering across both product types.

6. **`expected_arrival_at` set to a past or present timestamp** means the supply is immediately available as inventory (`RECEIVED`).
   This is the intended mechanism for "supply that arrives right now."
