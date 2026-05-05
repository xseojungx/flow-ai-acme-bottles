# ACME Bottles — API Contract

> Single source of truth for all API request/response shapes.
> All responses follow the envelope format defined in Section 1.

---

## 1. Response Envelope

### Success — single object

```json
{
  "message": "string",
  "data": {}
}
```

### Success — list

```json
{
  "message": "string",
  "data": {
    "items": [],
    "total": 0
  }
}
```

### Error

```json
{
  "message": "string"
}
```

### Validation Error (400)

```json
{
  "message": "Validation error",
  "errors": [{ "code": "string", "path": [], "message": "string" }]
}
```

---

## 2. Shared Enums

```ts
type MaterialType = "PET" | "PTA" | "EG";
type ProductType = "L1" | "G1"; // L1 = 1L Bottle, G1 = 1G Bottle
type OrderStatus = "PENDING" | "IN_PRODUCTION" | "COMPLETED";
type FulfillmentStatus = "ON_TIME" | "DELAYED" | "UNABLE_TO_FULFILL";
type SupplyStatus = "RECEIVED" | "ORDERED"; // runtime-derived, never stored
```

---

## 3. Supply Orders

### `POST /api/supply-orders`

Create a new supply order.

**Request body**

```json
{
  "material_type": "PET", // required — MaterialType
  "quantity": 5000, // required — integer, > 0, unit: grams
  "expected_arrival_at": "2025-06-01T00:00:00Z", // required — ISO 8601 datetime
  "supplier_name": "Supplier Co.", // optional
  "tracking_number": "TRK-001" // optional
}
```

**Response `201`**

```json
{
  "message": "Supply order created",
  "data": {
    "id": "uuid",
    "material_type": "PET",
    "quantity": 5000,
    "supplier_name": "Supplier Co.",
    "tracking_number": "TRK-001",
    "expected_arrival_at": "2025-06-01T00:00:00.000Z",
    "created_at": "2025-05-05T12:00:00.000Z",
    "status": "ORDERED"
  }
}
```

> `status` is **runtime-derived**: `expected_arrival_at <= NOW` → `RECEIVED`, else `ORDERED`.

---

### `GET /api/supply-orders`

List all supply orders, newest first.

**Response `200`**

```json
{
  "message": "Supply orders fetched",
  "data": {
    "items": [
      {
        "id": "uuid",
        "material_type": "PET",
        "quantity": 5000,
        "supplier_name": "Supplier Co.",
        "tracking_number": "TRK-001",
        "expected_arrival_at": "2025-06-01T00:00:00.000Z",
        "created_at": "2025-05-05T12:00:00.000Z",
        "status": "ORDERED"
      }
    ],
    "total": 1
  }
}
```

---

### `GET /api/supply-orders/summary`

현재 수령된 재료 수량과 완료된 구매 주문이 소비한 수량, 잔여 가용 수량을 반환한다.

**Response `200`**

```json
{
  "message": "Supply summary fetched",
  "data": {
    "received":  { "PET": 500000, "PTA": 300000, "EG": 150000 },
    "consumed":  { "PET": 120000, "PTA": 90000,  "EG": 40000  },
    "available": { "PET": 380000, "PTA": 210000, "EG": 110000 }
  }
}
```

> 모든 수치는 그램(g) 단위.  
> `consumed` = `expected_arrival_at ≤ NOW`인 공급 주문 기준, COMPLETED 구매 주문이 소비한 재료량.  
> `available = received − consumed` (최소 0).

---

## 4. Purchase Orders

### `POST /api/purchase-orders`

Create a new purchase order. Status defaults to `PENDING`.

**Request body**

```json
{
  "customer_name": "Acme Corp", // required — non-empty string
  "product_type": "L1", // required — ProductType
  "quantity": 1000, // required — integer, > 0, unit: bottles
  "notes": "Rush order" // optional
}
```

**Response `201`**

```json
{
  "message": "Purchase order created",
  "data": {
    "id": "uuid",
    "customer_name": "Acme Corp",
    "product_type": "L1",
    "quantity": 1000,
    "status": "PENDING",
    "notes": "Rush order",
    "created_at": "2025-05-05T12:00:00.000Z",
    "completed_at": null
  }
}
```

---

### `GET /api/purchase-orders`

List all purchase orders, newest first. Includes runtime-calculated scheduling fields.

**Response `200`**

```json
{
  "message": "Purchase orders fetched",
  "data": {
    "items": [
      {
        "id": "uuid",
        "customer_name": "Acme Corp",
        "product_type": "L1",
        "quantity": 1000,
        "status": "PENDING",
        "notes": null,
        "created_at": "2025-05-05T12:00:00.000Z",
        "completed_at": null,

        "material_ready_at": "2025-05-05T12:00:00.000Z",
        "start_at": "2025-05-05T12:00:00.000Z",
        "eta": "2025-05-05T12:30:00.000Z",
        "fulfillment_status": "ON_TIME",
        "days_late": null
      }
    ],
    "total": 1
  }
}
```

> `material_ready_at`, `start_at`, `eta`, `fulfillment_status`, `days_late` are **runtime-derived** on every read.
> For `UNABLE_TO_FULFILL` orders, `material_ready_at`/`start_at`/`eta` are not meaningful — use `fulfillment_status` to identify them.
> `days_late` is `null` for `ON_TIME` and `UNABLE_TO_FULFILL` orders. For `DELAYED` orders it is the number of days the ETA is pushed back relative to what it would be if all supply were available immediately.

---

### `PATCH /api/purchase-orders/:id/status`

Advance an order's status. Only the next valid transition is accepted.

```
PENDING → IN_PRODUCTION → COMPLETED
```

**Request body**

```json
{
  "status": "IN_PRODUCTION" // "IN_PRODUCTION" | "COMPLETED"
}
```

**Response `200`**

```json
{
  "message": "Purchase order status updated",
  "data": {
    "id": "uuid",
    "customer_name": "Acme Corp",
    "product_type": "L1",
    "quantity": 1000,
    "status": "IN_PRODUCTION",
    "notes": null,
    "created_at": "2025-05-05T12:00:00.000Z",
    "completed_at": null
  }
}
```

> `completed_at` is set automatically when transitioning to `COMPLETED`.

**Errors**

| Status | Condition                                             |
| ------ | ----------------------------------------------------- |
| `404`  | Order not found                                       |
| `400`  | Invalid transition (e.g. `COMPLETED → IN_PRODUCTION`) |

---

## 5. Production Status

### `GET /api/production/status`

Returns the current production state for each line. All fields are runtime-calculated.

**Response `200`**

```json
{
  "message": "Production status fetched",
  "data": {
    "L1": {
      "in_production": {
        "id": "uuid",
        "customer_name": "Acme Corp",
        "product_type": "L1",
        "quantity": 2000,
        "status": "IN_PRODUCTION",
        "notes": null,
        "created_at": "2025-05-05T08:00:00.000Z",
        "completed_at": null,
        "material_ready_at": "2025-05-05T08:00:00.000Z",
        "start_at": "2025-05-05T08:00:00.000Z",
        "eta": "2025-05-05T09:00:00.000Z",
        "fulfillment_status": "ON_TIME",
        "days_late": null
      },
      "queue": [
        {
          "id": "uuid",
          "customer_name": "Beta Ltd",
          "product_type": "L1",
          "quantity": 4000,
          "status": "PENDING",
          "notes": null,
          "created_at": "2025-05-05T09:00:00.000Z",
          "completed_at": null,
          "material_ready_at": "2025-05-05T09:00:00.000Z",
          "start_at": "2025-05-05T09:00:00.000Z",
          "eta": "2025-05-05T11:00:00.000Z",
          "fulfillment_status": "ON_TIME",
          "days_late": null
        }
      ]
    },
    "G1": {
      "in_production": null,
      "queue": []
    }
  }
}
```

**Field notes**

| Field                | Description                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `in_production`      | The current `IN_PRODUCTION` order for this line, or `null` if idle                                                      |
| `queue`              | All `PENDING` orders for this line in FIFO order (oldest first)                                                         |
| `fulfillment_status` | `ON_TIME` — sufficient stock now · `DELAYED` — waiting on incoming supply · `UNABLE_TO_FULFILL` — no supply path exists |
| `start_at`           | When this order will begin production (accounts for line queue and material wait)                                       |
| `eta`                | When this order will finish production                                                                                  |
| `days_late`          | `DELAYED` only — how many days the ETA is pushed back vs. if supply were available now; `null` otherwise               |

> `COMPLETED` orders are excluded from this response entirely.
> `UNABLE_TO_FULFILL` orders appear in `queue` — identify them by `fulfillment_status`.

---

## 6. Error Reference

| HTTP Status | Meaning                                                      |
| ----------- | ------------------------------------------------------------ |
| `400`       | Bad request — validation failure or invalid state transition |
| `404`       | Resource not found                                           |
| `500`       | Internal server error                                        |
