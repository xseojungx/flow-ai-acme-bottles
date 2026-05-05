# ACME Bottles — Supply Chain Management System

## Getting Started

### Prerequisites

- Node.js v22
- MySQL
- npm

### Environment Setup

**Backend** — create `backend/.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/acme_bottles"
PORT=3000
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Database Setup

Create the `acme_bottles` database in MySQL first (Prisma will create it automatically if the user has `CREATE DATABASE` permission, but create it manually if not):

```sql
CREATE DATABASE acme_bottles;
```

Then run migrations and seed:

```bash
cd backend
npm ci
npm run db:migrate   # applies schema and automatically runs seed
```

To re-run the seed at any time:

```bash
npm run db:seed
```

### Running the App

Open two terminals:

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm ci
npm run dev
```

The frontend runs at `http://localhost:5173` and connects to the
backend at `http://localhost:3000`.

## Architecture & Design Decisions

### Design

I used Claude Design for UI/UX.

### Overall Structure

The project is split into two independent apps:

```
acme-bottles/
├── backend/    # Express API server
└── frontend/   # React SPA
```

### Backend — Layered Architecture

```
routes → controllers → services → repositories
```

- **Routes** — declare endpoints and attach middleware
- **Controllers** — parse requests, call services, return responses
- **Services** — business logic and orchestration
- **Repositories** — all Prisma database access

This separation keeps each layer testable and replaceable in isolation.

### Scheduling Logic Isolation

All ETA and fulfillment calculations live exclusively in
`scheduling.service.ts`. No scheduling math appears in routes,
controllers, or repositories. This makes the FIFO algorithm easy
to locate, read, and verify independently.

### Runtime-Derived Values

Four fields are never stored in the database:

| Field                | Derived from                                        |
| -------------------- | --------------------------------------------------- |
| `supply status`      | `expected_arrival_at <= NOW()` → RECEIVED           |
| `material_ready_at`  | FIFO loop over available + incoming supply          |
| `start_at` / `eta`   | `material_ready_at` + line queue position           |
| `fulfillment_status` | Whether current/incoming supply can cover the order |
| `days_late`          | `material_ready_at − ideal_eta` when DELAYED        |

Recalculating on every read keeps the database simple (two tables)
and ensures the displayed state always reflects the current moment
without requiring background jobs or triggers.

### Frontend Data Layer

- **TanStack Query v5** handles all server state — no `useEffect` for
  fetching, no manual loading/error state
- **Axios** instance is configured once with the base URL from
  `VITE_API_URL`; all API calls go through it
- Pages map directly to the three core domains:
  Production Status, Purchase Orders, Supplies

## Tradeoffs

### 1. Runtime Calculation vs. Storing ETA in the Database

ETA, `start_at`, `material_ready_at`, `fulfillment_status`, and `days_late` are
recalculated on every read instead of being persisted.

The stored approach would have been simpler on reads (plain SELECT),
but would require cascading updates on every write:

- A new purchase order shifts the `start_at` and `eta` of every
  subsequent order on the same line
- A supply order transitioning from ORDERED → RECEIVED changes the
  `fulfillment_status` of any DELAYED orders that were waiting on it

Managing those cascades correctly via triggers or application-level
UPDATE chains introduces more risk than just recomputing on read.
At this scale, correctness on every read matters more than read speed.

**Known limitation:** as order count grows, recalculating the full
FIFO loop on every request will degrade. A production system would
add a caching layer (e.g. Redis) or event-driven recomputation.

---

### 2. FIFO Loop Includes All Orders, Including COMPLETED

The scheduling loop iterates over every purchase order from the
oldest `created_at`, regardless of status.

COMPLETED orders are not there for line timing — they exit the loop
early without updating `lineBusyUntil`. They are there for **material
deduction**: each completed order has already consumed its materials,
so those quantities must be subtracted from `available` before any
subsequent order is evaluated.

Skipping completed orders would leave `available` inflated, causing
orders that should be DELAYED to appear ON_TIME.

Optimizing this with a cursor (start from the last completed order)
would require figuring out the correct cutoff point and carrying
forward the right material state — complexity that outweighs the
benefit at this scale.

---

## AI Tools and Prompting

This project was developed with **Claude Code** (claude-sonnet-4-6) as the primary AI coding assistant.

### Prompt Files

The following files were written before development began and loaded as persistent context to keep Claude's output consistent across the entire session.

---

**`CLAUDE.md`** — top-level instructions loaded automatically by Claude Code on every session.

Defined the mission (working system over production-grade architecture), the priority order (clarification → correct CRUD → layer separation → business logic), the full tech stack, hard coding rules (no `any`, named exports only, no `useEffect` for fetching, Zod as the single validation source, etc.), and the conditions under which Claude must stop and ask rather than proceed.

---

**`docs/requirements.md`** — the product requirements spec.

Captured the exact feature set (purchase orders, supply orders, production status), the two product types (L1 / G1), the two independent production lines and their capacities (2,000 / 1,500 bottles per hour), the three raw materials (PET, PTA, EG) and their per-unit gram requirements, the supply model (ORDERED / RECEIVED derived at runtime), and the explicit non-goals (no auth, no pricing, no inventory table, no concurrency handling).

---

**`docs/logic.md`** — the backend design specification.

Documented the confirmed database schema (two tables, no computed columns), all runtime-derived values, the step-by-step FIFO scheduling algorithm (how `material_ready_at`, `start_at`, `eta`, and `fulfillment_status` are computed in a single pass over all orders), the three fulfillment statuses (ON_TIME / DELAYED / UNABLE_TO_FULFILL) and their conditions, order status transition rules (PENDING → IN_PRODUCTION → COMPLETED), and key implementation warnings (no pre-deduction outside the loop, COMPLETED orders must still run through the loop for material accounting).

---

**`docs/api-contract.md`** — the API contract.

Defined the standard response envelope (`{ message, data }` for single objects; `{ message, data: { items, total } }` for lists), all request/response shapes for the seven endpoints (POST and GET supply orders, supply summary, POST / GET / PATCH purchase orders, GET production status), shared enum types, `days_late` semantics, and the HTTP error reference.

---

**`docs/patterns/backend.md`** — backend code patterns.

Specified the folder structure (`routes/`, `controllers/`, `services/`, `repositories/`, `dtos/`), layer responsibilities and forbidden cross-layer calls, Zod validation placement (controller boundary only), error handling flow (`next(error)` → centralized middleware), and response shape conventions.

---

**`docs/patterns/frontend.md`** — frontend code patterns.

Specified the folder structure, the mandatory three-state data-fetching pattern (loading / error / data), one-file-per-hook conventions for TanStack Query (`useGet<Entity>` / `usePost<Entity>`), the Axios instance setup, the `API_DOMAINS` and `QUERY_KEYS` constants pattern, the local-state form pattern (no form library), a component internal order rule (hooks → derived values → return), an accessibility checklist (ARIA labels, keyboard navigation, focus management), and the 120-line component split threshold.

---

**`.claude/settings.json`** — permission configuration for Claude Code.

Restricted Claude from reading sensitive files (`.env*`, `*.pem`, `*.key`, `secrets/`, `.aws/`, `.ssh/`, etc.) during the session to prevent accidental exposure of credentials.

---

### Prompt that I used

---

I'm designing the FIFO scheduling algorithm for a production system before writing any code.
Your job is to find flaws in my design — not implement it.

Read @docs/logic.md in full before responding. That document is the single source of truth  
 for this system's confirmed decisions. Do not reference anything outside it.

---

## What I want you to verify

- whether my logic is correct and complete
- any edge cases I haven't handled
- any step that could produce a wrong result under valid inputs

### 1. Inventory initialization

I derive available inventory by summing all supply_orders where expected_arrival_at <= NOW().

- Is this the right boundary condition (< vs <=)?
- Are there cases where this produces a wrong initial value?

### 2. FIFO loop ordering

I sort all purchase orders by created_at ASC, regardless of status.

- Is there a case where this ordering produces incorrect results?
- What happens if two orders share the exact same created_at?

### 3. Incoming supply consumption

I consume from incoming_supplies in ascending expected_arrival_at order until the deficit is covered.

- If two incoming supply records for the same material have the same expected_arrival_at,  
  does the order matter?
- Can a single incoming supply record be partially consumed, or is it all-or-nothing?

---

## Rules for your response

- Do NOT implement any code yet.
- Do NOT suggest improvements to the spec — only identify what is wrong or missing.
- If any part of the design is ambiguous and you cannot determine correctness without
  making an assumption, stop and ask me. Do not guess.
- If a section is correct, say so in one line and move on.
- Flag the most critical flaw first.

---

## Given More Time

### Frontend

- **Zod validation on forms** — client-side schema validation mirroring the backend Zod schemas, so invalid input is caught before a network round-trip
- **Accessibility** — ARIA labels, keyboard navigation, and screen-reader-friendly markup; currently untested with assistive technology
- **Pagination** — the orders and supplies tables load all rows at once; large datasets would need cursor-based pagination
- **Better empty and error states** — loading skeletons and per-component error boundaries instead of top-level fallbacks
- **Real-time updates** — polling or WebSocket so production status reflects changes without a manual refresh

### Backend

- **Test coverage** — unit tests for `scheduling.service.ts` (the FIFO algorithm is the core of the system and the most likely place for regressions) and integration tests against a real test database
- **Timezone handling** — all dates are stored and compared in UTC, but the seed and the `days_late` calculation assume the server clock is reliable; worth verifying behavior when the host timezone differs from the client
- **Structured error handling** — currently errors bubble up to a generic handler; a proper error class hierarchy (e.g. `NotFoundError`, `ValidationError`) would make API responses more informative and easier to handle on the frontend
- **Authentication** — no auth layer exists; adding JWT or session-based auth would be the first step toward a production-ready system

### AI-Assisted Development Workflow

- **Migrate `docs/` into `.claude/commands` and skills** — the convention and API contract documents in `docs/` are referenced manually; breaking them into focused slash commands (e.g. `/new-endpoint`, `/add-repository`) would let Claude load only the relevant context per task
- **Keep `CLAUDE.md` in sync** — several conventions evolved during development (e.g. the `days_late` field, the supply status derivation pattern) that were not reflected back into `CLAUDE.md`; a short update pass after each feature would keep the file accurate
- **OpenAPI / Swagger spec** — generating a machine-readable API spec from the Zod schemas would give Claude (and human reviewers) a single authoritative reference for request/response shapes

---

## Issues Encountered

### Prisma Version Mismatch

Development started with Prisma 7 installed, but the code was written against Prisma 6 APIs (the version used in a prior reference project). This caused confusing runtime errors mid-way through, since the two major versions have breaking differences in client initialization and query behavior. The fix was to pin back to Prisma 6 (`6.19.3`) across all packages. Going forward, pinning the exact version in `package.json` from the start — rather than accepting the latest — would prevent this class of issue.
