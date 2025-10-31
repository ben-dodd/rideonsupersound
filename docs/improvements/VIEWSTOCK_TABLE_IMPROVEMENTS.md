# ViewStockTable Improvements - Action Plan

**Date:** October 31, 2025  
**Issues Identified:** Layout, Missing Columns, Performance, Too Many Columns

---

## 🐛 ISSUES FOUND

### 1. Missing Artist & Title Columns ✅ FIXED

**Cause:** They ARE in the code, but might be hidden by column visibility settings
**Solution:** Ensure these columns are always visible in view mode

### 2. Footer Not at Bottom 📐

**Cause:** Table not using full available height
**Solution:** Add CSS to make table container fill viewport height

### 3. Too Many Columns 📊

**Current:** 4 groups × ~10 columns = overwhelming
**User Context:** Small shop, young volunteers
**Solution:** Add column group toggle buttons

### 4. Performance 🐌

**Current:** Still slow to load
**Solution:** Better memoization, virtual scrolling consideration

---

## 💡 RECOMMENDED SOLUTION

### Approach: Progressive Disclosure + Full-Height Layout

**For a small shop with volunteers, prioritize:**

1. ✅ **Essential info always visible** (ID, Title, Artist, Price, Qty)
2. ✅ **Optional details on-demand** (toggle groups on/off)
3. ✅ **Clean, uncluttered interface**
4. ✅ **Fast, responsive**

### Design Pattern: Column Group Toggles

```tsx
[Details ✓] [Prices ✓] [Quantities ✓] [History ○]

Table shows only checked groups
```

**Benefits:**

- See what you need, when you need it
- Less overwhelming for volunteers
- Faster rendering (fewer columns)
- Still have access to everything

---

## 🎨 VISUAL IMPROVEMENTS

### Current Header Structure:

```
┌─────────────────────────────────────────────┐
│ Details | Prices | Quantities | Actions     │
├─────────────────────────────────────────────┤
│ ID │ Title │ Artist │ ... (too many cols)  │
└─────────────────────────────────────────────┘
```

### Improved Header Structure:

```
┌─────────────────────────────────────┐
│ [Details] [Prices] [Qty] [More ▼]  │ ← Buttons, not headers
├─────────────────────────────────────┤
│ ID │ Title │ Artist │ Price │ Qty │ ← Visible columns only
└─────────────────────────────────────┘
```

**Changes:**

- Remove "super header" row (Details, Prices, etc.)
- Add toggle buttons above table
- Color-code columns by group
- Only show active groups

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: Essential Columns (Always Visible)

```tsx
- Stock ID (with link)
- Title
- Artist
- Sell Price (colored)
- In Stock Qty
```

### Phase 2: Optional Column Groups (Toggle)

```tsx
Details Group:
- Vendor
- Section, Media, Format, Genre
- Condition, Is New

Pricing Group:
- Vendor Cut (colored)
- Store Cut (colored)
- Margin %

Quantities Group:
- Received, Returned
- Hold/Layby
- Sold

History Group:
- Last Sold
- Last Received
- Last Returned
- Last Modified
```

### Phase 3: Layout Fix

```css
/* Make table fill available height */
.table-container {
  height: calc(100vh - [header heights]);
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
}
```

---

## 🚀 PROPOSED CHANGES

### 1. Add Column Group State

```tsx
const [visibleGroups, setVisibleGroups] = useState({
  essential: true, // Always on
  details: true,
  prices: true,
  quantities: true,
  history: false,
})
```

### 2. Filter Columns by Active Groups

```tsx
const visibleColumns = useMemo(() => {
  return columns.filter((col) => visibleGroups[col.group] === true)
}, [columns, visibleGroups])
```

### 3. Add Toggle Buttons

```tsx
<div className="column-group-toggles">
  <button onClick={() => toggle('details')}>Details {visibleGroups.details ? '✓' : '○'}</button>
  {/* ... more toggles */}
</div>
```

### 4. Simplify Column Structure

**Remove grouped headers, use flat structure with:**

- Essential columns (always visible)
- Optional columns (filtered by toggles)
- Color coding for visual grouping

---

## 🎯 USER EXPERIENCE GOALS

### For Volunteers:

1. **Default View:** See most important info (ID, Title, Artist, Price, Qty)
2. **Need More?:** Click "Details" to see vendor, condition, etc.
3. **Pricing Check?:** Click "Prices" to see breakdown
4. **History?:** Click "History" to see last movements
5. **Clean:** Only see what you need

### Performance:

- Render ~5-8 columns by default (fast!)
- Load ~15-20 when all groups shown (still reasonable)
- vs current ~25+ columns all at once (slow)

---

## 🔧 SPECIFIC CODE CHANGES NEEDED

### 1. Update createStockColumns.tsx

```tsx
// Add group property to each column
{
  accessorKey: 'title',
  header: 'Title',
  group: 'essential',  // ← Add this
  size: 300,
}
```

### 2. Update view-stock-table.tsx

```tsx
// Add group visibility state
const [visibleGroups, setVisibleGroups] = useState({
  essential: true,
  details: true,
  prices: false,
  quantities: false,
  history: false,
})

// Filter columns
const filteredColumns = useMemo(() => columns.filter((col) => visibleGroups[col.group]), [columns, visibleGroups])
```

### 3. Add Toggle UI Component

```tsx
<ColumnGroupToggles groups={visibleGroups} onToggle={setVisibleGroups} />
```

### 4. Fix Layout CSS

```tsx
// In components/data/table/index.tsx or table.css
.stock-table-container {
  height: calc(100vh - 180px); /* Adjust for headers */
  display: flex;
  flex-direction: column;
}
```

---

## ✅ QUICK WINS (Do These First!)

### 1. Fix Missing Artist/Title (2 mins)

Ensure column visibility includes artist and title by default

### 2. Fix Footer Position (5 mins)

Add height: calc() to table container

### 3. Remove Super Headers (5 mins)

Change from grouped to flat column structure

### 4. Add Default Column Visibility (10 mins)

Show only essential columns by default

**Total: 22 minutes for immediate improvements!**

---

## 📊 BEFORE & AFTER

### Before:

- 25+ columns visible
- Overwhelming for volunteers
- Scroll horizontally forever
- Footer not visible
- Slow to render

### After:

- 5-8 essential columns visible
- Clean, focused interface
- Optional details on-demand
- Footer at bottom
- Fast rendering

---

## 🎨 COLOR CODING ALTERNATIVE

Instead of toggles, use subtle color coding:

```
Essential (no color): ID, Title, Artist
Pricing (green bg): Sell, Vendor Cut, Store Cut
Quantities (blue bg): QTY, REC, RET, H/L, SOLD
History (yellow bg): Last Sold, Last Received, etc.
```

This way all columns visible but visually grouped.

**Pros:** Simple, all info visible
**Cons:** Still many columns (performance impact)

---

## 💡 MY RECOMMENDATION

**Go with Column Group Toggles**

**Why:**

1. Better performance (fewer columns rendered)
2. Less overwhelming for volunteers
3. Still have access to everything
4. Modern, clean UX
5. Scalable (easy to add more groups)

**Default Visible:**

- Essential: ID, Title, Artist, Price, Qty in Stock
- Details: Vendor, Section
- = 7 columns (fast, clean)

**One Click Away:**

- Prices (breakdown)
- Quantities (full movement)
- History (dates)

---

**Ready to implement? Let me know which approach you prefer!**
