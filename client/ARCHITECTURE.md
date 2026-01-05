# Architecture Documentation

> **Note**: See [README.md](./README.md) for user-facing documentation, installation instructions, and feature overview. This document focuses on technical architecture and implementation details.

## 📋 Table of Contents

- [Setup Status](#setup-status)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Core Implementation](#core-implementation)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Migration Strategy](#migration-strategy)

## ✅ Setup Status

### Installed Dependencies

**Production:**

- `zustand` - Lightweight state management
- `@tanstack/react-query` - Data fetching and caching
- `nanoid` - Unique ID generation
- `framer-motion` - Animation library
- `sonner` - Toast notifications

**Development:**

- `@tanstack/react-query-devtools` - Query debugging interface

### Configuration Files

- ✅ `tsconfig.json` - TypeScript strict mode
- ✅ `vite.config.ts` - Vite build configuration
- ✅ `react-router.config.ts` - React Router v7 setup
- ✅ `tailwind.config.js` (via @theme in app.css) - Design tokens

## 🛠 Technology Stack

### Framework & Build Tools

- **React Router v7.10.1** - Full-stack React framework with SSR
- **React 19.2.3** - Latest React with concurrent features
- **TypeScript 5.9.2** - Type safety
- **Vite 7.1.7** - Lightning-fast build tool
- **Tailwind CSS 4.1.13** - Utility-first styling

### State & Data

- **TanStack Query v5** - Server state with caching, optimistic updates, background sync
- **Zustand** - Client state for UI, filters, modals (with devtools middleware)
- **localStorage** - Persistence layer (easily replaceable with API)

### Rationale

- **React Router over Next.js**: Better control over SSR, simpler setup, framework-agnostic
- **TanStack Query over SWR**: Superior optimistic updates, better devtools, richer mutation API
- **Zustand over Context/Redux**: Minimal boilerplate, great DX, built-in devtools

## 📁 Project Structure

```
client/
├── app/                     # Application source code
│   ├── assets/             # Static assets
│   │   ├── fonts/Poppins/  # Custom fonts
│   │   └── images/         # Images
│   ├── components/         # React components (feature-based)
│   │   ├── filters/       # CategoryFilter, SearchBar
│   │   ├── flashcard/     # Card, CardGrid, StudyCard
│   │   ├── forms/         # CardForm, FormField
│   │   └── ui/            # Button, Modal, Input (reusable)
│   ├── data/               # Static/initial data
│   │   └── data.json      # Seed flashcards
│   ├── hooks/              # Custom React hooks
│   │   ├── index.ts
│   │   └── use-flashcards.ts  # TanStack Query hooks
│   ├── lib/                # Utilities and services
│   │   ├── api/            # Data layer abstraction
│   │   │   └── flashcards.ts  # CRUD operations
│   │   ├── query-client.ts # TanStack Query config
│   │   └── utils.ts        # Helper functions
│   ├── routes/             # Page components (React Router)
│   │   ├── all-cards.tsx  # Grid view with filters
│   │   ├── home.tsx       # Landing/dashboard
│   │   └── study-mode.tsx # Single card study
│   ├── stores/             # Zustand stores
│   │   ├── index.ts
│   │   └── ui-store.ts    # UI state (filters, modals, study)
│   ├── types/              # TypeScript type definitions
│   │   ├── flashcard.ts   # Domain types
│   │   └── index.ts
│   ├── app.css             # Global styles, Tailwind config
│   ├── root.tsx            # Root component with providers
│   └── routes.ts           # Route configuration
├── build/                  # Production build output
│   ├── client/            # Static assets
│   └── server/            # SSR server code
├── public/                 # Static files (served as-is)
│   └── favicon.ico
├── Dockerfile              # Container configuration
├── package.json
├── react-router.config.ts
├── tsconfig.json
└── vite.config.ts
```

### Folder Organization Principles

**By Feature (components/):**

- Groups related components together
- Easier to locate and maintain
- Clear domain boundaries

**By Type (hooks/, stores/, types/):**

- Shared across features
- Single responsibility
- Easy to import

## 🏛 Architecture Patterns

### 1. Separation of Concerns

**Layers:**

```
Presentation Layer (components/)
       ↓
Business Logic Layer (hooks/)
       ↓
Data Access Layer (lib/api/)
       ↓
Persistence Layer (localStorage/API)
```

**Benefits:**

- Testable in isolation
- Easy to swap implementations
- Clear responsibilities

### 2. State Management Strategy

**Two-Tier State:**

| Aspect          | TanStack Query       | Zustand      |
| --------------- | -------------------- | ------------ |
| **Purpose**     | Server state         | Client state |
| **Data**        | Flashcards (CRUD)    | UI state     |
| **Persistence** | Cache + localStorage | Memory only  |
| **Syncing**     | Background refetch   | N/A          |
| **Optimistic**  | Yes                  | N/A          |

**Why this split?**

- Avoids prop drilling
- Separate concerns (data vs UI)
- Better performance (granular subscriptions)
- Easier testing

### 3. Custom Hooks Pattern

All data operations wrapped in custom hooks:

```typescript
// ❌ Don't: Component directly calls API
function Component() {
  const [data, setData] = useState([]);
  useEffect(() => {
    flashcardsApi.getFlashcards().then(setData);
  }, []);
}

// ✅ Do: Use custom hook
function Component() {
  const { data, isLoading } = useFlashcards();
}
```

**Benefits:**

- Centralized logic
- Consistent error handling
- Easy to mock for testing
- Reusable across components

### 4. Type-First Development

**Flow:**

1. Define types in `types/`
2. Implement API with typed signatures
3. Hooks infer types automatically
4. Components get full autocomplete

```typescript
// 1. Define type
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  knownCount: number;
}

// 2. Type API function
export async function getFlashcards(): Promise<Flashcard[]> { ... }

// 3. Hook inherits type
export function useFlashcards() {
  return useQuery<Flashcard[]>(...);
}

// 4. Component has full type safety
function CardList() {
  const { data } = useFlashcards(); // data is Flashcard[]
}
```

## 🔧 Core Implementation

## 🔧 Core Implementation

### 1. Type System (`types/flashcard.ts`)

**Core Types:**

```typescript
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  knownCount: number; // 0-5 mastery level
  createdAt?: string;
  updatedAt?: string;
}

type CreateFlashcardInput = Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateFlashcardInput = Partial<Omit<Flashcard, 'id' | 'createdAt'>> & {
  id: string;
};
```

**Supporting Types:**

- `CategoryWithCount` - For filter UI
- `StudyStatistics` - Progress dashboard
- `FlashcardFilters` - Filter state shape
- `ViewMode` - 'all' | 'study'
- `SortOption` - Sorting strategies

### 2. Data Layer (`lib/api/flashcards.ts`)

**Key Functions:**

- `getFlashcards()` - Fetch all, initializes localStorage from data.json
- `getFlashcard(id)` - Fetch single card
- `createFlashcard(input)` - Create with nanoid ID
- `updateFlashcard(input)` - Update with timestamp
- `deleteFlashcard(id)` - Remove card
- `incrementKnownCount(id)` - Mastery tracking (max 5)
- `resetKnownCount(id)` - Reset progress to 0

**Features:**

- Simulated async delays (100-300ms) for realistic UX
- localStorage as persistence layer
- Fallback to `data.json` on first load
- SSR-safe (checks `typeof window`)
- Type-safe returns

**Example:**

```typescript
export async function createFlashcard(
  input: CreateFlashcardInput
): Promise<Flashcard> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network

  const newCard: Flashcard = {
    ...input,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const flashcards = await getFlashcards();
  const updated = [...flashcards, newCard];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newCard;
}
```

### 3. TanStack Query Hooks (`hooks/use-flashcards.ts`)

**Query Hooks:**

- `useFlashcards()` - List all cards with automatic caching
- `useFlashcard(id)` - Single card with conditional fetching

**Mutation Hooks:**

- `useCreateFlashcard()` - Optimistic creation with toast
- `useUpdateFlashcard()` - Optimistic updates with rollback
- `useDeleteFlashcard()` - Optimistic deletion with rollback
- `useIncrementKnownCount()` - Silent progress update
- `useResetKnownCount()` - Progress reset with toast

**Features:**

- Query key factory for cache management
- Optimistic updates with rollback on error
- Automatic cache invalidation
- Toast notifications on success/error
- TypeScript inference from API layer

**Example:**

```typescript
export function useUpdateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flashcardsApi.updateFlashcard,

    // Optimistically update UI
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['flashcards'] });
      const previous = queryClient.getQueryData(['flashcards']);

      queryClient.setQueryData(['flashcards'], (old: Flashcard[]) =>
        old.map((card) => (card.id === input.id ? { ...card, ...input } : card))
      );

      return { previous };
    },

    // Rollback on error
    onError: (err, input, context) => {
      queryClient.setQueryData(['flashcards'], context.previous);
      toast.error('Failed to update');
    },

    // Refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}
```

### 4. Zustand Store (`stores/ui-store.ts`)

**State Slices:**

**View Mode:**

- `viewMode`: 'all' | 'study'
- `setViewMode(mode)`

**Filters:**

- `filters`: { categories, hideMastered, searchQuery }
- `setFilters(partial)`
- `resetFilters()`

**Study Mode:**

- `currentCardIndex`, `isCardFlipped`, `isShuffled`
- `nextCard(totalCards)`, `previousCard()`
- `flipCard()`, `resetStudyMode()`

**Modals:**

- `isCardFormOpen`, `editingCardId`
- `openCardForm(cardId?)`, `closeCardForm()`

**Pagination:**

- `currentPage`, `cardsPerPage`
- `loadMore()`, `resetPagination()`

**Implementation:**

```typescript
export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      viewMode: 'all',
      setViewMode: (mode) => set({ viewMode: mode }),

      filters: { categories: [], hideMastered: false, searchQuery: '' },
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      // ... more state and actions
    }),
    { name: 'ui-store' }
  )
);
```

**Benefits:**

- Single source of truth for UI
- Redux DevTools integration
- No prop drilling
- Selective re-renders

### 5. Utility Functions (`lib/utils.ts`)

**Data Processing:**

- `getCategoriesWithCounts(cards)` - Extract unique categories
- `calculateStatistics(cards)` - Compute progress stats
- `filterFlashcards(cards, filters)` - Apply all filters
- `shuffleArray(array)` - Fisher-Yates shuffle

**UI Helpers:**

- `getMasteryStatus(count)` - "Not Started" | "In Progress" | "Mastered"
- `getMasteryColor(count)` - Tailwind color classes
- `getProgressPercentage(count)` - 0-100%
- `formatDate(isoString)` - Human-readable dates
- `cn(...classes)` - Conditional class names

**Example:**

```typescript
export function calculateStatistics(flashcards: Flashcard[]): StudyStatistics {
  return {
    total: flashcards.length,
    mastered: flashcards.filter((c) => c.knownCount === 5).length,
    inProgress: flashcards.filter((c) => c.knownCount > 0 && c.knownCount < 5)
      .length,
    notStarted: flashcards.filter((c) => c.knownCount === 0).length,
  };
}
```

### 6. Root Configuration (`root.tsx`)

**Provider Setup:**

```typescript
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>...</head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

**QueryClient Config (`lib/query-client.ts`):**

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache 5 min
      gcTime: 10 * 60 * 1000, // Keep 10 min
      retry: 1,
      refetchOnWindowFocus: false, // Dev convenience
    },
    mutations: {
      retry: 1,
    },
  },
});
```

## 🔄 Data Flow

## 🔄 Data Flow

### Read Flow (Query)

```
Component mounts
    ↓
useFlashcards() hook called
    ↓
TanStack Query checks cache
    ↓
Cache miss? → Call flashcardsApi.getFlashcards()
    ↓
Read from localStorage (or data.json if empty)
    ↓
Return data to component
    ↓
Component renders with data
```

### Write Flow (Mutation)

```
User clicks "Create Flashcard"
    ↓
Component calls createMutation.mutate(data)
    ↓
useCreateFlashcard() hook executes
    ↓
TanStack Query calls flashcardsApi.createFlashcard()
    ↓
Generate ID with nanoid, add timestamps
    ↓
Write to localStorage
    ↓
Mutation success
    ↓
Invalidate ['flashcards'] query
    ↓
TanStack Query refetches data
    ↓
Component re-renders with new data
    ↓
Toast notification appears
```

### Optimistic Update Flow

```
User edits flashcard
    ↓
Component calls updateMutation.mutate(changes)
    ↓
onMutate: Cancel in-flight queries
    ↓
onMutate: Snapshot current cache
    ↓
onMutate: Optimistically update cache
    ↓
Component IMMEDIATELY re-renders (appears instant)
    ↓
API call to flashcardsApi.updateFlashcard()
    ↓
Success? → onSettled: Refetch for consistency
    ↓
Error? → onError: Rollback to snapshot + show toast
```

**Why Optimistic Updates?**

- Instant UI feedback (feels faster)
- Better UX for slow connections
- Automatic rollback on errors
- Consistency guaranteed via refetch

## 🗂 State Management

### TanStack Query (Server State)

**Purpose:** Manage flashcard data (source of truth)

**Responsibilities:**

- Fetching and caching flashcard data
- CRUD mutations with optimistic updates
- Background refetching and sync
- Request deduplication
- Error handling and retries

**Query Keys:**

```typescript
flashcardKeys = {
  all: ['flashcards'],
  lists: () => [...flashcardKeys.all, 'list'],
  details: () => [...flashcardKeys.all, 'detail'],
  detail: (id) => [...flashcardKeys.details(), id],
};
```

**Cache Strategy:**

- `staleTime: 5 min` - Data fresh for 5 minutes
- `gcTime: 10 min` - Keep unused data 10 minutes
- `retry: 1` - Retry failed requests once
- `refetchOnWindowFocus: false` - Disabled in dev

### Zustand (Client State)

**Purpose:** Manage UI state (ephemeral)

**Responsibilities:**

- View mode (all cards vs study)
- Filter settings (categories, search, hide mastered)
- Study mode state (current card, flip state)
- Modal state (open/closed, editing ID)
- Pagination state (current page, per page)

**Benefits:**

- No provider hell
- Minimal boilerplate
- Redux DevTools integration
- Selective subscriptions (performance)

**Usage Pattern:**

```typescript
// Subscribe to specific slice
function FilterBar() {
  const filters = useUIStore((state) => state.filters);
  const setFilters = useUIStore((state) => state.setFilters);

  // Only re-renders when filters change
}
```

### State Boundaries

| State Type        | Storage        | Persists?                | Source of Truth     |
| ----------------- | -------------- | ------------------------ | ------------------- |
| Flashcard data    | TanStack Query | Yes (localStorage)       | Server/localStorage |
| UI filters        | Zustand        | No                       | Client memory       |
| Study progress    | TanStack Query | Yes (knownCount in data) | Server/localStorage |
| Modal open/closed | Zustand        | No                       | Client memory       |

## 🚀 Migration Strategy

### Phase 1: localStorage (Current)

```typescript
// lib/api/flashcards.ts
export async function getFlashcards(): Promise<Flashcard[]> {
  const stored = localStorage.getItem('flashcards');
  return stored ? JSON.parse(stored) : [];
}
```

**Pros:** Simple, fast, no backend needed
**Cons:** Per-device only, no sync, size limits

### Phase 2: React Router Actions (Optional)

```typescript
// routes/flashcards.tsx
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const flashcard = await createFlashcard(formData);
  return json(flashcard);
}
```

**Pros:** SSR benefits, progressive enhancement
**Cons:** Still file-based or requires DB

### Phase 3: Full Backend (Future)

```typescript
// lib/api/flashcards.ts
export async function getFlashcards(): Promise<Flashcard[]> {
  const response = await fetch('/api/flashcards', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}
```

**Changes needed:**

1. Replace localStorage calls with fetch
2. Add authentication layer
3. Add database (PostgreSQL + Prisma)
4. Deploy backend (same server or separate)

**What stays the same:**

- Hook signatures remain identical
- Component code unchanged
- Type definitions unchanged
- TanStack Query config mostly same

### Migration Checklist

- [ ] Set up authentication (Clerk/Auth.js)
- [ ] Create database schema
- [ ] Build REST/GraphQL/tRPC API
- [ ] Replace `lib/api/flashcards.ts` implementation
- [ ] Add error handling for network issues
- [ ] Implement data sync/conflict resolution
- [ ] Deploy backend
- [ ] Update environment variables

## 📋 Next Development Steps

### Phase 1: UI Components (Foundation)

- [ ] `Button` - Consistent button styles
- [ ] `Input` - Form input with validation
- [ ] `Textarea` - Multi-line input
- [ ] `Modal` - Dialog for create/edit
- [ ] `Select` - Category dropdown

### Phase 2: Flashcard Components

- [ ] `FlashCard` - Flippable card with Framer Motion
- [ ] `CardGrid` - Responsive grid layout
- [ ] `StudyCard` - Large card for study mode
- [ ] `ProgressBar` - Visual mastery indicator

### Phase 3: Forms & Filters

- [ ] `CardForm` - Create/edit flashcard form
- [ ] `CategoryFilter` - Multi-select with counts
- [ ] `SearchBar` - Real-time search input
- [ ] `SortControls` - Sort by date, category, mastery

### Phase 4: Pages

- [ ] `home.tsx` - Statistics dashboard
- [ ] `all-cards.tsx` - Grid view with filters
- [ ] `study-mode.tsx` - Single card study interface

### Phase 5: Features

- [ ] Keyboard shortcuts (Space to flip, arrows to navigate)
- [ ] Shuffle mode implementation
- [ ] Load more pagination
- [ ] Responsive design (mobile/tablet/desktop)

### Phase 6: Polish

- [ ] Accessibility audit (ARIA, keyboard nav)
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Animation refinement
- [ ] Performance optimization

## 🔍 Development Guidelines

### Adding a New Feature

1. **Define types** in `types/`
2. **Add API function** in `lib/api/`
3. **Create hook** in `hooks/`
4. **Build component** in `components/`
5. **Integrate in route** in `routes/`

### Naming Conventions

- **Components:** PascalCase (`FlashCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useFlashcards.ts`)
- **Utils:** camelCase (`formatDate`)
- **Types:** PascalCase (`Flashcard`)
- **Constants:** SCREAMING_SNAKE_CASE (`STORAGE_KEY`)

### Code Organization

**Do:**

- ✅ Keep components small and focused
- ✅ Extract reusable logic to hooks
- ✅ Colocate related files
- ✅ Use barrel exports (`index.ts`)

**Don't:**

- ❌ Mix UI and business logic
- ❌ Duplicate API calls in components
- ❌ Use magic numbers (define constants)
- ❌ Skip TypeScript types (`any`)

### Testing Strategy

**Type Safety:**

```bash
npm run typecheck  # Run before commits
```

**Manual Testing:**

- React Query DevTools for data inspection
- Zustand DevTools (Redux DevTools extension)
- localStorage inspection (Application tab)

**Future:**

- Unit tests with Vitest
- Component tests with Testing Library
- E2E tests with Playwright

## 📚 References

- [React Router v7 Docs](https://reactrouter.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated:** January 5, 2026
