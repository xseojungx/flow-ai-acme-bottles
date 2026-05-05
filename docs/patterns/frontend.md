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
// pages/<domain>/<Entity>List.tsx
export const EntityList = () => {
  const { data, isLoading, isError } = useGetEntities({ ... });

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
};
```

**Query hook** — one file per hook:

```ts
// services/<domain>/query/useGet<Entity>.ts
import { QUERY_KEYS } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export const useGetEntities = ({ param }: { param: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ENTITY, param],
    queryFn: () => getEntities({ param }),
  });
};
```

**Mutation hook** — one file per hook:

```ts
// services/<domain>/mutation/usePost<Entity>.ts
import { QUERY_KEYS } from "@/constants/api";
import { useHandleReactQueryError } from "@/hooks/useHandleError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EntityDto) => postEntity(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTITY] }),
    onError: useHandleReactQueryError,
  });
};
```

**Rules:**

- `queryKey` always uses `QUERY_KEYS` constants from `@/constants/api` — never inline strings
- `invalidateQueries` only inside `onSuccess` — never elsewhere
- API calls live in `src/api/<domain>/handle<Entity>.api.ts` — never inline `instance` in hooks

---

## API Layer

```ts
// api/<domain>/handle<Entity>.api.ts
import { instance } from "@/api/axiosInstance";
import { generateApiPath } from "@/api/utils";
import { API_DOMAINS } from "@/constants/api";
import { ApiResponse } from "@/types/common/ApiResponse.types";

export const getEntities = async ({
  param,
}: {
  param: number;
}): Promise<EntityType> => {
  const response = await instance.get<ApiResponse<EntityType>>(
    generateApiPath(API_DOMAINS.ENTITY, { param }),
  );
  return response.data.result;
};

export const postEntity = async (data: EntityDto): Promise<void> => {
  await instance.post(API_DOMAINS.ENTITY, data);
};
```

```ts
// api/axiosInstance.ts — instantiated once, never elsewhere
export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
setupInterceptors(instance);
```

```ts
// constants/api.ts — URL and query key constants
export const API_DOMAINS = {
  ENTITY: "/entity/:param",
};

export const QUERY_KEYS = {
  ENTITY: "entity",
};
```

**Rules:**

- `instance` instantiated once in `api/axiosInstance.ts` only
- Every function unwraps the envelope (`response.data.result`) before returning
- Return types always explicit — no inferred `any` from axios
- All API paths defined in `API_DOMAINS` or `SELLER_API_DOMAINS` in `constants/api.ts`
- Dynamic path segments (`:paramName`) resolved with `generateApiPath()` from `@/api/utils`

---

## Form Pattern

Local `useState` only — no external form library.

```tsx
// pages/<domain>/components/Create<Entity>Modal.tsx
type CreateEntityModalProps = { onClose: () => void };
type FormState = { field: string };

const INITIAL_STATE: FormState = { field: "" };

export const CreateEntityModal = ({ onClose }: CreateEntityModalProps) => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = usePostEntity();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // validate → setError on failure, mutate on pass
    mutate(form, {
      onSuccess: onClose,
      onError: () => setError("Failed. Please try again."),
    });
  };

  return (
    <dialog open aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">...</h2>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="field">...</label>
        <input
          id="field"
          name="field"
          value={form.field}
          onChange={handleChange}
        />
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
      </form>
    </dialog>
  );
};
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

**Keyboard Navigation**

- [ ] Every action reachable by Tab
- [ ] Enter / Space activates buttons and checkboxes
- [ ] Escape closes modals and dropdowns

**Focus Management**

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
export const ComponentName = ({ prop }: ComponentNameProps) => {
  // 4. Hooks — query → mutation → state → ref
  // 5. Derived values and handlers
  // 6. Return
};
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
├── components/
├── services/
│   └── <domain>/
│       ├── query/        # useGet<Entity>.ts — one hook per file
│       └── mutation/     # usePost<Entity>.ts, usePatch<Entity>.ts, … — one hook per file
├── api/
│   ├── axiosInstance.ts
│   └── <domain>/         # handle<Entity>.api.ts
├── types/
├── constants/
│   └── api.ts            # API_DOMAINS, SELLER_API_DOMAINS, QUERY_KEYS
├── hooks/
├── utils/
└── routes/
```
