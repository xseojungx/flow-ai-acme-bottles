## Mission (CRITICAL)

PRIMARY GOAL:

- Correct implementation of required features
- Working end-to-end system
- NOT production-grade architecture

PRIORITIES (in order):

1. Ask for clarification if requirements are ambiguous
2. Working CRUD flows and Correct data modeling
3. Clean separation of layers
4. Minimal but correct business logic

AVOID:

- Over-engineering
- Premature abstraction
- Designing for scale
- Implementing unconfirmed logic

---

## Project Overview

Supply Chain Management + Production Scheduling system for ACME Bottles.

System must support:

- Supply tracking
- Purchase order tracking
- Production visibility

---

## Stack

**Backend** — Express · TypeScript (strict) · Prisma · Zod · dotenv · MySQL
**Frontend** — React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · TanStack Query v5 · React Router v7 · Axios

---

## Hard Rules

- No `any` — use `unknown` and narrow, or define the type explicitly
- Named exports only — no default exports anywhere
- No `useEffect` for data fetching — use TanStack Query
- No inline styles — Tailwind utility classes only
- `interface` for API response shapes; `type` for props, unions, and computed types
- Zod schema is the single source of validation truth on the backend — no ad-hoc `if` checks on request fields
- All API responses must follow the envelope in `docs/api-contract.md` — no bare returns
- Scheduling logic lives exclusively in `backend/src/services/scheduling.service.ts` — no scheduling calculations in routes or controllers
- `schema.prisma` is the single source of truth for all data shapes — do not duplicate DB types manually

## When to Stop and Ask

- Adding any new `npm` dependency (either side)
- Creating a file outside the folder structure defined in `docs/conventions.md`
- Any change to API response shape or shared type structure
- Acceptance criteria for scheduling edge cases (material shortage, delay calculation) are ambiguous
