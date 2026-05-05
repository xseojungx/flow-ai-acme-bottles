# ACME Bottles — Requirements

---

## 1. System Goal

Build a simplified Supply Chain Management and Production Processing System.

The system must:

- Track incoming supplies
- Track purchase orders
- Provide production visibility

---

## 2. Supported Features (MUST)

### Purchase Orders

- Create a purchase order
- Persist to database
- List purchase orders
- Sorted by newest first (created_at DESC)

---

### Supply Orders

- Create a supply order
- Select material type (PET, PTA, EG)
- Persist to database
- List supply orders
- Sorted by newest first (created_at DESC)

---

### Production Status

- Show current production for each production line
- Show all purchase orders
- Orders must follow FIFO order
- Show expected start date if it has not started
- Show expected completion date(ETA) if it has not completed

---

## 3. Products (STRICT)

Only two products exist:

- 1L Bottle
- 1G Bottle

No additional products are allowed.

---

## 4. Production Lines (STRICT)

Two independent production lines:

### 1L Line

- Produces ONLY 1L bottles
- Capacity: 2000 bottles/hour

### 1G Line

- Produces ONLY 1G bottles
- Capacity: 1500 bottles/hour

---

### Global Rules

- Runs 24 hours per day
- No downtime
- No production delay
- Always operates at full capacity
- Lines operate independently

---

## 5. Materials

All bottles are made from the following three raw materials:

- PET
- PTA
- EG

---

## 6. Material Requirements Per Unit

### 1G Bottle

- PET: 65g
- PTA: 45g
- EG: 20g

### 1L Bottle

- PET: 20g
- PTA: 15g
- EG: 10g

---

## 7. Supply Model (STRICT)

### Units

- All material quantities are measured in grams (g)

### SupplyOrder

Each supply order contains:

- material_type: PET | PTA | EG
- quantity (grams)
- status: ORDERED | RECEIVED
- expected_arrival_at (Date)
- created_at
- supplier_name
- tracking_number

---

### Inventory Rule (CRITICAL)

- ONLY supplies with status = RECEIVED are considered available
- When a supply becomes RECEIVED → it is immediately available as inventory
- No separate inventory table exists
- Inventory is derived from SupplyOrder records

---

## 8. Supply Assumptions (IMPORTANT)

- Supplies have NO cost
- Orders have NO price
- No shipping or logistics
- No storage constraints
- Products are fulfilled immediately after production

---

## 9. Order Processing Rules

- Orders follow FIFO (First-In, First-Out)
- Orders are assigned to production line based on product type
- Production lines operate independently

---

## 10. Required Calculations (HIGH PRIORITY)

System MUST calculate:

- Order fulfillment status
- Expected production completion time

---

## 11. Supply Availability Logic

System must support:

- Sufficient supplies → normal processing
- Insufficient but incoming supplies → delayed, with an updated completion date based on incoming
  supply ETAs, it has to calculate both delayed date and expected completion date if the supply was sufficient
- if no existing or incoming supplies can fulfill the order → unable to fulfill

---

## 12. Required Pages (from mockups)

### Production Status Page

- Current production per line
- Upcoming orders (FIFO)
- Expected start date
- Expected completion date

---

### Purchase Orders Page

- Create purchase order
- List purchase orders

---

### Supplies Page

- Create supply order
- List supply orders

---

## 13. Required API Behavior

System must provide:

- Purchase Order API
- Supply API
- Production Status API

---

## 14. Non-Goals (VERY IMPORTANT)

The system MUST NOT include:

- Authentication
- Authorization
- Pricing logic
- Shipping logic
- Inventory storage system
- Multi-user concurrency handling
- Optimization algorithms

---

## 15. Constraints for Implementation

- Focus on correctness over completeness
- Keep implementation simple
- Avoid unnecessary abstractions
- Avoid premature optimization

---

## STRICT RULE

When encountering undefined areas:

- DO NOT guess
- DO NOT invent logic
- DO NOT create temporary implementations

Instead:

- Leave explicit TODO comments
- Ask for clarification if needed
