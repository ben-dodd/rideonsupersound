# Stock Table Component Improvements

## Analysis of `features/stock/view-stock-table.tsx`

### Executive Summary

The ViewStockTable component is functional but has several areas for improvement in TypeScript typing, performance optimization, code quality, and maintainability. Below is a comprehensive list of improvements categorized by priority.

---

## 🔴 HIGH PRIORITY ISSUES

### 1. TypeScript Type Safety

**Current Issues:**

- No type definitions for component props (should be typed even if no props)
- Event handlers lack proper typing (`handleSearch = (e)` should be `(e: React.ChangeEvent<HTMLInputElement>)`)
- Implicit `any` types throughout
- Column definitions not using proper TanStack Table types
- Missing interface for collated stock list structure

**Recommended Fix:**

```typescript
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import { StockItemSearchObject } from 'lib/types/stock'

interface CollatedStockItem extends StockItemSearchObject {
  quantities: {
    inStock: number
    received: number
    returned: number
    holdLayby: number
    sold: number
  }
  lastMovements: {
    modified?: string
    sold?: string
    received?: string
    returned?: string
  }
}

interface ViewStockTableProps {
  // Add any props if needed in future
}

const ViewStockTable: React.FC<ViewStockTableProps> = () => {
  // ...
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchBar(Pages.stockPage, e.target.value, 'list')

  const columns = useMemo<ColumnDef<CollatedStockItem>[]>(
    () => [
      // ...
    ],
    [router],
  ) // Add router to deps since it's used in column definitions
}
```

### 2. Performance Optimization Issues

**Problems:**

- Heavy `collateStockList` computation runs whenever filtered list changes
- No memoization of filtered stock list
- Columns dependency array is empty but uses `router` (potential stale closure)
- No React.memo on component

**Recommended Fixes:**

```typescript
// 1. Memoize filtered stock list
const filteredStockList = useMemo(
  () => stockList?.filter((stockItem) => filterInventory(stockItem, searchBar)),
  [stockList, searchBar],
)

// 2. Add router to columns dependencies or extract to separate hook
const columns = useMemo(() => createColumns(router), [router])

// 3. Consider React.memo for the component
export default React.memo(ViewStockTable)

// 4. Consider debouncing the search input
const debouncedSearch = useMemo(
  () => debounce((value: string) => setSearchBar(Pages.stockPage, value, 'list'), 300),
  [setSearchBar],
)
```

### 3. Production Code Issues

**Problems:**

- `console.log(filters)` left in code (line 23)
- Commented out code: `// console.log(data)` (line 192)

**Fix:** Remove all console.logs and commented code

---

## 🟡 MEDIUM PRIORITY ISSUES

### 4. Accessibility Problems

**Issues:**

- Clickable spans instead of buttons (`<span className="link-blue" onClick={...}>`)
- No keyboard navigation for clickable elements
- No ARIA labels for interactive elements
- Icons without text alternatives

**Recommended Fixes:**

```typescript
// Replace spans with buttons
{
  accessorKey: 'id',
  header: 'Stock ID',
  cell: (info) => (
    <button
      type="button"
      className="link-blue hover:underline focus:outline-none focus:ring-2"
      onClick={() => router.push(`/stock/${info.getValue()}`)}
      aria-label={`View stock item ${getItemSku(info.row?.original)}`}
    >
      {getItemSku(info.row?.original)}
    </button>
  ),
  size: 100,
}

// Add text alternatives for icons
{
  accessorKey: 'isNew',
  header: 'Is New?',
  size: 50,
  cell: (info) => info?.getValue() ? (
    <Check aria-label="Yes, is new" />
  ) : (
    <Close className="text-red-500" aria-label="No, not new" />
  ),
}
```

### 5. Code Duplication

**Problem:** EditStockTable and ViewStockTable share significant code

**Recommendation:** Create shared utilities

```typescript
// features/stock/hooks/useStockTableData.ts
export const useStockTableData = (filterType: 'list' | 'edit') => {
  const {
    pages: {
      stockPage: {
        filter: { [filterType]: filters },
        searchBar: { [filterType]: searchBar },
      },
    },
    setPageFilter,
    setSearchBar,
  } = useAppStore()

  const { stockList = [], isStockListLoading = true } = useStockList()
  const { stockMovements = [], isStockMovementsLoading = true } = useAllStockMovements()

  const filteredStockList = useMemo(
    () => stockList?.filter((stockItem) => filterInventory(stockItem, searchBar)),
    [stockList, searchBar],
  )

  const collatedStockList = useMemo(
    () => collateStockList(filteredStockList, stockMovements),
    [filteredStockList, stockMovements],
  )

  return {
    collatedStockList,
    isLoading: isStockListLoading || isStockMovementsLoading,
    filters,
    searchBar,
    setPageFilter,
    setSearchBar,
  }
}

// features/stock/utils/createStockColumns.tsx
export const createStockColumns = (router: NextRouter, isEditable = false): ColumnDef<CollatedStockItem>[] => {
  // Column definitions here
}
```

### 6. State Management Issues

**Problems:**

- State initialized from props might not sync properly
- Multiple useEffect hooks for related state updates could be consolidated

**Recommended Fix:**

```typescript
// Instead of separate state + useEffect, sync directly
useEffect(() => {
  if (filters?.pagination) setPagination(filters.pagination)
  if (filters?.sorting) setSorting(filters.sorting)
  if (filters?.visibleColumns) setColumnVisibility(filters.visibleColumns)
}, [filters])

// Or better: remove local state if it just mirrors store state
// and use store state directly with callbacks
```

---

## 🟢 LOW PRIORITY / NICE-TO-HAVE

### 7. Maintainability Improvements

**Column Organization:**

```typescript
// features/stock/columns/stockTableColumns.tsx
export const detailColumns = (router): ColumnDef[] => [...]
export const priceColumns: ColumnDef[] = [...]
export const quantityColumns: ColumnDef[] = [...]
export const actionColumns: ColumnDef[] = [...]

// Then combine
const columns = useMemo(
  () => [
    { header: 'Details', columns: detailColumns(router) },
    { header: 'Prices', columns: priceColumns },
    { header: 'Quantities', columns: quantityColumns },
    { header: 'Actions', columns: actionColumns },
  ],
  [router]
)
```

### 8. Error Handling

**Add error states:**

```typescript
const { stockList = [], isStockListLoading = true, error: stockListError } = useStockList()

if (stockListError) {
  return <ErrorScreen message="Failed to load stock list" />
}
```

### 9. Loading States

**Current:** Shows loading for entire component
**Better:** Show skeleton or progressive loading

```typescript
if (isStockListLoading) {
  return <TableSkeleton />
}

if (isStockMovementsLoading) {
  return <Table data={stockList} /* ... */ isLoading={true} />
}
```

### 10. Styling Improvements

**Issues:**

- Inconsistent color coding (some cells colored, some not)
- Magic color strings (`text-blue-500`, `text-red-500`, `text-green-500`)

**Recommendation:**

```typescript
// Create a theme constant
const STOCK_TABLE_COLORS = {
  sell: 'text-blue-500',
  vendorCut: 'text-red-500',
  storeCut: 'text-green-500',
  link: 'link-blue hover:underline',
} as const
```

### 11. Testing Considerations

**Add test IDs:**

```typescript
<span className="link-blue" onClick={() => router.push(`/stock/${info.getValue()}`)} data-testid="stock-item-link">
  {getItemSku(info.row?.original)}
</span>
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Critical Fixes (Do First)

- [ ] Add TypeScript types for all functions and variables
- [ ] Remove console.log statements
- [ ] Remove commented code
- [ ] Add memoization to filtered stock list
- [ ] Fix columns dependency array

### Phase 2: Quality Improvements

- [ ] Replace clickable spans with buttons
- [ ] Add ARIA labels
- [ ] Extract shared code with EditStockTable
- [ ] Add error handling
- [ ] Consolidate useEffect hooks

### Phase 3: Maintainability

- [ ] Extract columns to separate files
- [ ] Create shared hooks
- [ ] Add test IDs
- [ ] Improve loading states
- [ ] Create theme constants

---

## 🎯 QUICK WINS (Can implement immediately)

1. **Remove debug code** (30 seconds)

   ```typescript
   // DELETE: console.log(filters)
   // DELETE: // console.log(data)
   ```

2. **Add types to handleSearch** (1 minute)

   ```typescript
   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
     setSearchBar(Pages.stockPage, e.target.value, 'list')
   ```

3. **Fix columns memo dependencies** (1 minute)

   ```typescript
   const columns = useMemo(() => [...], [router])
   ```

4. **Memoize filtered list** (2 minutes)
   ```typescript
   const filteredStockList = useMemo(
     () => stockList?.filter((stockItem) => filterInventory(stockItem, searchBar)),
     [stockList, searchBar],
   )
   ```

---

## 📊 COMPARISON WITH SIMILAR COMPONENTS

### EditStockTable vs ViewStockTable

**Differences:**

- EditStockTable uses `EditCell` for some columns
- EditStockTable has fewer columns (no grouped quantities/actions)
- Both share ~80% of the same code

**Recommendation:** Create base component or shared utilities to reduce duplication

---

## 🔍 ADDITIONAL NOTES

### Consider These Patterns

1. **Virtual scrolling** for large datasets (react-window/react-virtual)
2. **Server-side pagination** if dataset is very large
3. **Column persistence** - save user's column preferences
4. **Export functionality** - CSV/Excel export
5. **Bulk actions** - already supported via row selection but could be enhanced

### Modern React Patterns to Adopt

- Use `React.FC<Props>` for better type inference
- Consider moving to functional updates for setState
- Use custom hooks to extract complex logic
- Consider React Query/SWR for better data management (already using SWR hooks)

---

## 📖 REFERENCES

- [TanStack Table TypeScript Guide](https://tanstack.com/table/v8/docs/guide/typescript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
