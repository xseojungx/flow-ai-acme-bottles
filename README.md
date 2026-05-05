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
