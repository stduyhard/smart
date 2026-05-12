import { getPivotSourceById } from '../data/orderModel';
import type { PivotLayout } from '../types/pivot';
import { buildPivotResult, type PivotResult } from '../utils/pivotEngine';

export interface PivotQueryRequest {
  sourceId: string;
  layout: PivotLayout<string>;
  filters?: Record<string, string[]>;
}

export interface PivotQueryResponse {
  ok: true;
  result: PivotResult;
}

export async function executePivotQuery(request: PivotQueryRequest): Promise<PivotQueryResponse> {
  const source = getPivotSourceById(request.sourceId);
  if (!source) {
    throw new Error(`数据源 ${request.sourceId} 不存在`);
  }

  const result = buildPivotResult(source, request.layout, request.filters ?? {});

  return { ok: true, result };
}
