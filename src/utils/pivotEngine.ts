import type { PivotLayout, PivotSourceDefinition } from '../types/pivot';

export interface PivotResult {
  rowHeaders: string[][];
  columnHeaders: string[][];
  cells: Record<string, number>;
}

function buildCompositeKey(row: any, fields: string[]): string[] {
  return fields.map((f) => String(row[f] ?? ''));
}

function keyToString(parts: string[]): string {
  return parts.join('|');
}

export function buildPivotResult(
  source: PivotSourceDefinition,
  layout: PivotLayout<string>,
  filters: Record<string, string[]>,
): PivotResult {
  const measureField = layout.measures[0];
  if (!measureField) {
    return { rowHeaders: [], columnHeaders: [], cells: {} };
  }

  const rowFields = layout.rows.length > 0 ? layout.rows : [];
  const colFields = layout.columns.length > 0 ? layout.columns : [];

  let filteredRows = source.rows;

  for (const [field, values] of Object.entries(filters)) {
    if (values.length > 0) {
      filteredRows = filteredRows.filter((row: any) => values.includes(String(row[field])));
    }
  }

  // Collect unique row/column header composites
  const rowKeySet = new Set<string>();
  const colKeySet = new Set<string>();

  for (const row of filteredRows) {
    if (rowFields.length > 0) {
      rowKeySet.add(keyToString(buildCompositeKey(row, rowFields)));
    }
    if (colFields.length > 0) {
      colKeySet.add(keyToString(buildCompositeKey(row, colFields)));
    }
  }

  const rowHeaders = [...rowKeySet].sort().map((k) => k.split('|'));
  const columnHeaders = [...colKeySet].sort().map((k) => k.split('|'));
  const cells: Record<string, number> = {};

  // Build cell values
  for (const rh of rowHeaders) {
    for (const ch of columnHeaders) {
      const matching = filteredRows.filter((row: any) => {
        const rowMatch = rowFields.every((f, i) => String(row[f]) === rh[i]);
        const colMatch = colFields.every((f, i) => String(row[f]) === ch[i]);
        return rowMatch && colMatch;
      });
      const total = matching.reduce((sum, row) => sum + Number((row as any)[measureField] ?? 0), 0);
      const cellKey = `${keyToString(rh)}|${keyToString(ch)}|${measureField}`;
      cells[cellKey] = Number(total.toFixed(2));
    }
  }

  // Compute subtotals when there are 2+ row dimensions
  if (rowFields.length > 1) {
    const parentFields = rowFields.slice(0, -1);
    const parentKeySet = new Set<string>();

    for (const row of filteredRows) {
      parentKeySet.add(keyToString(buildCompositeKey(row, parentFields)));
    }

    const parentKeys = [...parentKeySet].sort();

    for (const parentKey of parentKeys) {
      const subtotalRowKey = [...parentKey.split('|'), '合计'];
      if (!rowKeySet.has(keyToString(subtotalRowKey))) {
        rowHeaders.push(subtotalRowKey);
      }

      for (const ch of columnHeaders) {
        let total = 0;
        for (const rh of rowHeaders) {
          // Only include detail rows that are under this parent
          if (rh.length > 1 && rh[rh.length - 1] !== '合计') {
            const isUnderParent = parentFields.every((_f, i) => rh[i] === parentKey.split('|')[i]);
            if (isUnderParent) {
              const detailKey = `${keyToString(rh)}|${keyToString(ch)}|${measureField}`;
              total += cells[detailKey] ?? 0;
            }
          }
        }
        const subtotalKey = `${keyToString(subtotalRowKey)}|${keyToString(ch)}|${measureField}`;
        cells[subtotalKey] = Number(total.toFixed(2));
      }

      // Grand subtotal across all columns
      let grandTotal = 0;
      for (const ch of columnHeaders) {
        grandTotal += cells[`${keyToString(subtotalRowKey)}|${keyToString(ch)}|${measureField}`] ?? 0;
      }
      cells[`${keyToString(subtotalRowKey)}|${measureField}`] = Number(grandTotal.toFixed(2));
    }
  }

  return { rowHeaders, columnHeaders, cells };
}
