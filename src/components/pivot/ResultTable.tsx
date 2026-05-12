import type { PivotResult } from '../../utils/pivotEngine';

type ResultTableProps = {
  result: PivotResult;
  measureLabel: string;
};

export default function ResultTable({ result, measureLabel }: ResultTableProps) {
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
        {result.rowHeaders.map((row, ri) => (
          <tr key={ri}>
            <th>{row.join(' / ')}</th>
            {result.columnHeaders.map((col, ci) => {
              const cellKey = `${row.join('|')}|${col.join('|')}|${measureLabel}`;
              return (
                <td key={ci}>
                  {result.cells[cellKey] ?? 0}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
