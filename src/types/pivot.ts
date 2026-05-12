export type PivotZone = 'rows' | 'columns' | 'measures' | 'filters';
export type PivotDimensionZone = 'rows' | 'columns' | 'filters';

export type PivotFieldType = 'dimension' | 'measure';

export interface PivotField<
  FieldKey extends string = string,
  FieldType extends PivotFieldType = PivotFieldType,
> {
  key: FieldKey;
  label: FieldKey;
  type: FieldType;
  allowedZones: readonly PivotZone[];
}

export interface PivotLayout<FieldKey extends string = string> {
  rows: FieldKey[];
  columns: FieldKey[];
  measures: FieldKey[];
  filters: FieldKey[];
}

export interface PivotSourceDefinition<
  SourceId extends string = string,
  FieldKey extends string = string,
  Row extends object = object,
> {
  id: SourceId;
  name: string;
  description: string;
  fields: readonly PivotField<FieldKey>[];
  rows: Row[];
}
