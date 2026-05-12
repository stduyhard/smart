import {
  getPivotSourceById,
  listPivotSources,
} from '../data/orderModel';
import type { PivotSourceModel } from '../types/pivot';

export type DataSource = PivotSourceModel;

export async function listDataSources(): Promise<DataSource[]> {
  return listPivotSources();
}

export function getDataSourceById(sourceId: string): DataSource | null {
  return getPivotSourceById(sourceId);
}

export function isPivotSourceAvailable(sourceId: string): boolean {
  const source = getDataSourceById(sourceId);
  return Boolean(source?.selectable);
}
