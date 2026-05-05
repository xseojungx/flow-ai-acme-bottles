# Frontend Patterns

## Common Rules

These apply to every pattern below:

- Named exports only — no default exports
- No `useEffect` for data fetching — TanStack Query only
- No inline styles — Tailwind utility classes only
- `interface` for API response shapes; `type` for props, unions, and computed types
- Skeletons show structure only — replace placeholder names with domain specifics

---

## Data Fetching

All three states are required. Missing any is a bug.

```tsx
// features/<domain>/<Entity>List.tsx
export function EntityList() {
  const { data, isLoading, isError } = useEntities();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="..." />;
  if (!data?.items.length) return <EmptyState message="..." />;

  return (
    <ul>
      {data.items.map((item) => (
        <EntityRow key={item.id} item={item} />
      ))}
    </ul>
  );
}
```

**Query hook** — one file per domain:

```ts
// features/<domain>/hooks/use<Entity>.ts
export function useEntities() {
  return useQuery<EntityListResponse>({
    queryKey: ["entities"],
    queryFn: getEntities,
  });
}
```

**Mutation hook:**

```ts
// features/<domain>/hooks/useCreate<Entity>.ts
export function useCreateEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEntity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entities"] }),
  });
}
```

**Rules:**

- `queryKey` matches the domain: `['purchase-orders']`, `['supplies']`, `['production-status']`
- `invalidateQueries` only inside `onSuccess` — never elsewhere
- API calls live in `src/api/<domain>.api.ts` — never inline `axios` in hooks

---

## API Layer

```ts
// api/<domain>.api.ts
export async function getEntities(): Promise<EntityListResponse> {
  const { data } = await apiClient.get("/entities");
  return data.data; // unwrap envelope
}

export async function createEntity(dto: CreateEntityDto): Promise<void> {
  await apiClient.post("/entities", dto);
}
```

```ts
// api/client.ts — instantiated once, never elsewhere
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api",
});
```

**Rules:**

- `apiClient` instantiated once in `api/client.ts` only
- Every function unwraps the envelope (`data.data`) before returning
- Return types always explicit — no inferred `any` from axios

---

## Form Pattern

Local `useState` only — no external form library.

```tsx
// features/<domain>/components/Create<Entity>Modal.tsx
type Create<Entity>ModalProps = { onClose: () => void };
type FormState = { field: string };

const INITIAL_STATE: FormState = { field: "" };

export function CreateEntityModal({ onClose }: CreateEntityModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateEntity();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // validate → setError on failure, mutate on pass
    mutate(form, {
      onSuccess: onClose,
      onError: () => setError("Failed. Please try again."),
    });
  }

  return (
    <dialog open aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">...</h2>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="field">...</label>
        <input id="field" name="field" value={form.field} onChange={handleChange} />
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
      </form>
    </dialog>
  );
}
```

**Rules:**

- `e.preventDefault()` is always the first line of `handleSubmit`
- Client-side validation runs before `mutate` — never rely on backend errors alone
- Errors render in `role="alert"` so screen readers announce changes
- Submit button: `disabled` + label reflects `isPending`
- `INITIAL_STATE` defined as a constant outside the component

---

## Accessibility Checklist

Apply to every interactive component before marking done:

**ARIA**

- [ ] All inputs have an associated `<label htmlFor>` or `aria-label`
- [ ] Modal: `aria-modal="true"` + `aria-labelledby` pointing to its heading
- [ ] Error messages: `role="alert"`
- [ ] Loading indicators: `aria-busy="true"` or descriptive text

**Keyboard navigation**

- [ ] Every action reachable by Tab
- [ ] Enter / Space activates buttons and checkboxes
- [ ] Escape closes modals and dropdowns

**Focus management**

- [ ] Focus moves into a modal on open (`autoFocus` on first field, or `ref.current?.focus()`)
- [ ] Focus returns to the trigger element on close
- [ ] No focus trap outside a modal or drawer

---

## Component Structure

**Internal order is mandatory:**

```tsx
// 1. Props type
type ComponentNameProps = { ... };

// 2. Constants outside component
const CONSTANT = ...;

// 3. Component function
export function ComponentName({ prop }: ComponentNameProps) {
  // 4. Hooks — query → mutation → state → ref
  // 5. Derived values and handlers
  // 6. Return
}
```

**When to split:**

- Exceeds **120 lines** → extract a child component
- More than one independent loading/error state → split into separate fetching components
- Reused across features → move to `src/components/`

---

## Folder Structure

```
src/
├── pages/
├── utils/
├── components/
├── hooks/
└── types/
```
