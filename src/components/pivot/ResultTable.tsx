import type { PivotResult } from '../../utils/pivotEngine';

type ResultTableProps = {
  result: PivotResult;
  measureLabel: string;
  expandedKeys: string[];
  onToggleExpand: (key: string) => void;
};

interface RowGroup {
  parentLabel: string;
  detailRows: string[][];
  subtotalRow: string[][] | null;
}

function groupRows(rowHeaders: string[][]) {
  const groups: RowGroup[] = [];
  const seenParents = new Set<string>();

  for (const rh of rowHeaders) {
    if (rh.length <= 1) {
      // Single-level rows: no hierarchy
      groups.push({ parentLabel: rh[0], detailRows: [rh], subtotalRow: null });
    } else {
      const isSubtotal = rh[rh.length - 1] === '合计';
      const parentKey = isSubtotal ? rh.slice(0, -1).join('|') : rh.slice(0, 1)[0];

      if (!seenParents.has(parentKey)) {
        seenParents.add(parentKey);
        groups.push({ parentLabel: parentKey, detailRows: [], subtotalRow: null });
      }

      const group = groups.find((g) => g.parentLabel === parentKey);
      if (group) {
        if (isSubtotal) {
          group.subtotalRow = [rh];
        } else {
          group.detailRows.push(rh);
        }
      }
    }
  }

  return groups;
}

export default function ResultTable({ result, measureLabel, expandedKeys, onToggleExpand }: ResultTableProps) {
  const isHierarchical = result.rowHeaders.length > 0 && result.rowHeaders[0].length > 1;
  const groups = isHierarchical ? groupRows(result.rowHeaders) : null;

  function renderCell(row: string[], col: string[]) {
    const cellKey = `${row.join('|')}|${col.join('|')}|${measureLabel}`;
    return result.cells[cellKey] ?? 0;
  }

  return (
    <table className="pivot-result-table">
      <thead>
        <tr>
          <th>行标签</th>
          {result.columnHeaders.map((col, i) => (
            <th key={i}>{col.join(' / ')}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {groups ? (
          groups.map((group) => {
            const isExpanded = expandedKeys.includes(group.parentLabel);
            return (
              <Rows key={group.parentLabel}>
                {/* Parent row with toggle */}
                <tr>
                  <th>
                    <button
                      type="button"
                      className="pivot-expand-toggle"
                      onClick={() => onToggleExpand(group.parentLabel)}
                    >
                      {isExpanded ? '[-]' : '[+]'}
                    </button>
                    {group.parentLabel}
                  </th>
                  {result.columnHeaders.map((col, ci) => (
                    <td key={ci}>
                      {isExpanded
                        ? null
                        : group.subtotalRow
                          ? renderCell(group.subtotalRow[0], col)
                          : group.detailRows.reduce(
                              (sum, dr) => sum + Number(renderCell(dr, col)),
                              0,
                            )}
                    </td>
                  ))}
                </tr>
                {/* Detail rows - visible when expanded */}
                {isExpanded &&
                  group.detailRows.map((dr) => (
                    <tr key={dr.join('|')}>
                      <th style={{ paddingLeft: '28px' }}>
                        {dr[dr.length - 1]}
                      </th>
                      {result.columnHeaders.map((col, ci) => (
                        <td key={ci}>{renderCell(dr, col)}</td>
                      ))}
                    </tr>
                  ))}
                {/* Subtotal row - always visible */}
                {group.subtotalRow &&
                  group.subtotalRow.map((sr) => (
                    <tr key={sr.join('|')} className="pivot-result-table__subtotal">
                      <th>{sr.slice(0, -1).join(' / ')} 合计</th>
                      {result.columnHeaders.map((col, ci) => (
                        <td key={ci}>{renderCell(sr, col)}</td>
                      ))}
                    </tr>
                  ))}
              </Rows>
            );
          })
        ) : (
          /* Flat rendering for single-level rows */
          result.rowHeaders.map((row) => (
            <tr key={row.join('|')}>
              <th>{row.join(' / ')}</th>
              {result.columnHeaders.map((col, ci) => (
                <td key={ci}>{renderCell(row, col)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function Rows({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
