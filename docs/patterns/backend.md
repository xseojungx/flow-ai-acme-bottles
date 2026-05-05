## Folder Structure

```
src/
├── prisma/
├── controllers/    # Parse req/res → call service → send response
├── services/       # Business logic — never touches req/res
├── repositories/   # Prisma queries only — no business logic
├── models/
├── routes/ # URL mapping only
├── app.ts
├── middleware/
│   └── error.middleware.ts   # Global error handler — registered last
├── dtos/                     # Zod schemas + inferred TypeScript types
└── types/
       ├── express.d.ts          # Express Request augmentation
       └── app-error.ts          # Custom AppError class
```

## Architecture

```

Route → Controller → Service → Repository → Prisma → DB

```

Rules:

- Controllers NEVER call repositories directly
- Services contain ALL business logic
- Repositories ONLY contain Prisma queries
- No layer skipping

---

## 3. Layer Responsibilities

#### Controller

- Parse request
- Call service
- Return response
- Handle errors via next()

#### Service

- Business logic ONLY
- No Express dependency

#### Repository

- Prisma queries ONLY
- No business logic
- No complex branching

---

## 4. Execution Constraints

#### Single User Assumption

- Ignore race conditions
- No concurrency handling
- Avoid transactions unless strictly necessary

---

## 5. Validation Rules

- Use Zod for ALL inputs
- Validate at controller boundary
- Pass ONLY validated data to service

---

## 6. Error Handling Rules

- Wrap all async controllers in try/catch
- Always call `next(error)`
- Use centralized error middleware

---

## 7. Response Convention

#### Single

```json
{ "message": "", "data": {} }
```

#### List

```json
{ "message": "", "data": { "items": [], "total": number } }
```

---

## 8. Repository Rules

- Prisma only
- No derived logic
- Only simple filters allowed

---

## 9. Service Rules

- All business logic lives here
- No HTTP / Express usage

---

## 10. Forbidden Patterns

- No scheduling logic
- No derived fields (eta, computed status)
- No Prisma usage outside repository
- No logic inside controller
- No premature abstraction

---

## 11. Testing Policy

- Optional
- Prioritize implementation speed
