import type { PivotLayout } from '../types/pivot';

export interface PivotQueryRequest {
  sourceId: string;
  layout: PivotLayout<string>;
}

export interface PivotQueryResponse {
  ok: true;
}

export async function executePivotQuery(_request: PivotQueryRequest): Promise<PivotQueryResponse> {
  return Promise.resolve({ ok: true });
}
