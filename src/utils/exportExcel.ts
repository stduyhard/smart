import * as XLSX from 'xlsx';
import type { PivotResult } from './pivotEngine';

export function exportPivotToExcel(result: PivotResult, measureLabel: string) {
  const rows = result.rowHeaders.map((rowHeader) => {
    const row: Record<string, string | number> = { 行标签: rowHeader.join(' / ') };
    for (const colHeader of result.columnHeaders) {
      const cellKey = `${rowHeader.join('|')}|${colHeader.join('|')}|${measureLabel}`;
      row[colHeader.join(' / ')] = result.cells[cellKey] ?? 0;
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '透视结果');
  XLSX.writeFile(workbook, 'smartbi-pivot-result.xlsx');
}
