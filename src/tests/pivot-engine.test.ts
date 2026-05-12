import { describe, expect, it } from 'vitest';
import { orderModel, type OrderFieldKey } from '../data/orderModel';
import { buildPivotResult } from '../utils/pivotEngine';
import type { PivotLayout } from '../types/pivot';

describe('buildPivotResult', () => {
  it('builds a cross table for 发货区域 x 订单年份 with 销售额', () => {
    const layout: PivotLayout<OrderFieldKey> = {
      rows: ['发货区域'],
      columns: ['订单年份'],
      measures: ['销售额'],
      filters: [],
    };

    const result = buildPivotResult(orderModel, layout, {});

    expect(result.rowHeaders).toHaveLength(2);
    expect(result.columnHeaders).toHaveLength(2);

    const rowHeaderLabels = result.rowHeaders.map((r) => r[0]);
    expect(rowHeaderLabels).toEqual(expect.arrayContaining(['华东', '华南']));

    const colHeaderLabels = result.columnHeaders.map((c) => c[0]);
    expect(colHeaderLabels).toEqual(expect.arrayContaining(['2020年', '2021年']));

    // 华东 2020年: 南京(120000.5) + 上海(48203.6) = 168204.1
    expect(result.cells['华东|2020年|销售额']).toBe(168204.1);
    // 华东 2021年: 杭州(98000) = 98000
    expect(result.cells['华东|2021年|销售额']).toBe(98000);
    // 华南 2020年: 深圳(132500) = 132500
    expect(result.cells['华南|2020年|销售额']).toBe(132500);
    // 华南 2021年: 广州(143300.4) = 143300.4
    expect(result.cells['华南|2021年|销售额']).toBe(143300.4);
  });

  it('filters rows based on filter values', () => {
    const layout: PivotLayout<OrderFieldKey> = {
      rows: ['发货区域'],
      columns: ['订单年份'],
      measures: ['销售额'],
      filters: ['发货区域'],
    };

    const result = buildPivotResult(orderModel, layout, { '发货区域': ['华东'] });

    expect(result.rowHeaders).toHaveLength(1);
    expect(result.rowHeaders[0][0]).toBe('华东');
    // should NOT contain 华南 data
    expect(result.cells['华南|2020年|销售额']).toBeUndefined();
    expect(result.cells['华南|2021年|销售额']).toBeUndefined();
    expect(result.cells['华东|2020年|销售额']).toBe(168204.1);
  });

  it('computes subtotal for multi-level row dimensions', () => {
    const layout: PivotLayout<OrderFieldKey> = {
      rows: ['发货区域', '省份'],
      columns: ['订单年份'],
      measures: ['销售额'],
      filters: [],
    };

    const result = buildPivotResult(orderModel, layout, {});

    // Check that subtotal keys exist
    const subtotalKeys = Object.keys(result.cells).filter((k) => k.includes('合计'));
    expect(subtotalKeys.length).toBeGreaterThan(0);

    // 华东|合计|销售额 should exist
    const eastSubtotal = result.cells['华东|合计|销售额'];
    expect(eastSubtotal).toBeDefined();
    // 华东 total across all provinces and years
    // 120000.5 + 48203.6 + 98000 = 266204.1
    expect(eastSubtotal).toBe(266204.1);
  });
});
