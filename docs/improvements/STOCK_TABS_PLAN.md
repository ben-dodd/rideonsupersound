# Stock Tabs Implementation Plan

**Date:** October 31, 2025  
**Goal:** Create engaging components for Stock, Sales, Best Sellers, and Movement tabs

---

## 📊 DATA AVAILABLE

From `lib/api/stock.ts` and earlier analysis:

### CollatedStockList (from useStockTableData)

```typescript
{
  id, title, artist, vendorName,
  totalSell, vendorCut, storeCut,
  quantities: {
    inStock, received, returned, holdLayby, sold
  },
  lastMovements: {
    sold, received, returned, modified
  }
}
```

### StockMovements (from useStockMovements)

```typescript
{
  id, type, date, itemId, quantity, ...
}
```

---

## 🎯 TAB REQUIREMENTS

### Tab 2: Stock Arrivals (Recently Received)

**Goal:** Show newest stock in an appealing way
**Data:** Filter stockList by `lastMovements.received` (most recent first)
**Display:**

- Cards with album art / item images
- Title, Artist, Vendor
- Price, Quantity received
- Days since arrival
- Sort: Most recent first

### Tab 3: Recently Sold

**Goal:** Show what's selling
**Data:** Filter stockList by `lastMovements.sold` (most recent first)
**Display:**

- Similar card layout
- Sold date
- How many sold
- Revenue generated

### Tab 4: Best Sellers

**Goal:** Show top performing items
**Data:** Sort stockList by `quantities.sold` (highest first)
**Display:**

- Ranking cards (1st, 2nd, 3rd)
- Total sold count
- Total revenue
- Profit margin
- Could add "trending" indicator

### Tab 5: Stock Movement (Enhanced)

**Goal:** Visual movement log with graphs
**Data:** stockMovements API
**Display:**

- Timeline/log of movements
- Graphs showing:
  - Stock received over time
  - Stock sold over time
  - Stock returned over time
- Filters by type, date range

---

## 🎨 DESIGN APPROACH

### Shared Components

1. **StockCard** - Reusable card for displaying stock items
2. **StatBadge** - Small badge for stats (sold count, revenue, etc.)
3. **TimeAgo** - Display "3 days ago" style dates

### Layout Pattern

```tsx
<div className="p-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item) => (
      <StockCard {...item} />
    ))}
  </div>
</div>
```

---

## 📦 IMPLEMENTATION ORDER

1. ✅ Fix ColumnGroupToggles (done)
2. ✅ Replace Loading spinner (done)
3. Create shared StockCard component
4. Create Stock Arrivals tab
5. Create Recently Sold tab
6. Create Best Sellers tab
7. Enhance Stock Movement with graphs

---

## 🎨 STOCK CARD MOCKUP

```
┌─────────────────────────────┐
│ [Image]      Title          │
│              Artist         │
│              ─────────────  │
│              $15.00         │
│              Vendor: ABC    │
│                             │
│  [Badge: 5 sold]  [3 days] │
└─────────────────────────────┘
```

---

## 📊 GRAPHS FOR STOCK MOVEMENT

Check if recharts or chart.js is installed:

- Line graph: Stock levels over time
- Bar chart: Movement types (received, sold, returned)
- Area chart: Cumulative movements

---

## 🚀 QUICK START

Will create minimal viable versions first, then enhance:

1. **Stock Arrivals** - Simple card grid
2. **Recently Sold** - Simple card grid
3. **Best Sellers** - Card grid with rankings
4. **Movement** - Keep existing list, add simple charts

All use same ViewStockTable data source, just filtered/sorted differently!

---

**Ready to implement!**
