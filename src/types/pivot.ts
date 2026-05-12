export type PivotZone = 'rows' | 'columns' | 'measures' | 'filters';

export type PivotFieldType = 'dimension' | 'measure';

export interface PivotField {
  key: string;
  label: string;
  type: PivotFieldType;
}

export interface PivotLayout {
  rows: string[];
  columns: string[];
  measures: string[];
  filters: string[];
}
