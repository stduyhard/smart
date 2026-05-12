# Pivot Engine, Result Table, Filters & Export Design

## Scope

Implement the remaining 3 tasks (6-8) from the main plan: pivot engine + result table, filters + subtotals + expand/collapse, Excel export.

## Architecture

### pivotEngine.ts

```
buildPivotResult(source, layout, filters, expandedKeys) => PivotResult
```

- Maps layout field keys directly to row object keys (field key === row key, e.g. '发货区域')
- Supports N row dimensions (composited keys like "华东|江苏"), N column dimensions
- Aggregation: SUM on selected measure
- Filtering: excludes rows where field value not in filterValues
- Subtotals: adds "合计" column per parent group when rows have 2+ dims
- Expand/collapse: returns hierarchy metadata

**PivotResult type:**
```ts
interface PivotResult {
  rowHeaders: string[][]       // e.g. [["华东","江苏"],["华东","上海"]]
  columnHeaders: string[][]    // e.g. [["2020年"],["2021年"]]
  cells: Record<string, number> // key: "rowComposite|colComposite|measure"
  rowTree: PivotRowNode         // for expand/collapse rendering
}
```

### ResultTable.tsx

- Renders pivot result as HTML table
- Handles multi-level row/column headers
- Shows subtotal rows styled distinctly
- Expand/collapse toggle on parent row nodes
- Empty state when no result

### FilterPanel.tsx

- Renders for each field in filters zone
- Checkbox-list UI (not `<select multiple>`)
- Populates distinct values from source rows
- Writes to store.filterValues per-source

### Store extensions

- `filterValues: Record<string, string[]>` per-source
- `setFilterValues(sourceId, field, values)`
- `resetFilters` included in resetLayout

### Excel export

- `xlsx` library
- `exportPivotToExcel(result, layout, sourceName)` → .xlsx download
- Matches table structure with row/column headers and values
