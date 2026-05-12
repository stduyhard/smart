import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { orderFields, orderRows } from '../data/orderModel';
import { usePivotStore } from '../store/pivotStore';

const ordersSourceId = 'orders';
const customersSourceId = 'customers';

describe('usePivotStore', () => {
  beforeEach(() => {
    act(() => {
      const store = usePivotStore.getState();
      store.resetLayout(ordersSourceId);
      store.resetLayout(customersSourceId);
    });
  });

  it('adds 发货区域 into the rows layout zone for a source', () => {
    act(() => {
      usePivotStore.getState().addFieldToZone(ordersSourceId, '发货区域', 'rows');
    });

    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.rows).toEqual([
      '发货区域',
    ]);
    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.columns).toEqual([]);
    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.measures).toEqual([]);
    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.filters).toEqual([]);
  });

  it('keeps state isolated per source id', () => {
    act(() => {
      const store = usePivotStore.getState();
      store.addFieldToZone(ordersSourceId, '发货区域', 'rows');
      store.addFieldToZone(customersSourceId, '客户等级', 'filters');
    });

    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.rows).toEqual([
      '发货区域',
    ]);
    expect(usePivotStore.getState().sourceStates[customersSourceId]?.layout.filters).toEqual([
      '客户等级',
    ]);
    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.filters).toEqual([]);
  });

  it('validates fields against the active source schema instead of the orders model', () => {
    act(() => {
      const { addFieldToZone } = usePivotStore.getState();

      addFieldToZone(customersSourceId, '客户等级', 'filters');
      addFieldToZone(customersSourceId, '发货区域', 'filters');
    });

    expect(usePivotStore.getState().sourceStates[customersSourceId]?.layout.filters).toEqual([
      '客户等级',
    ]);
    expect(usePivotStore.getState().sourceStates[customersSourceId]?.layout.rows).toEqual([]);
    expect(usePivotStore.getState().sourceStates[customersSourceId]?.layout.columns).toEqual([]);
  });

  it('moves a dimension field between non-conflicting zones in the same source', () => {
    act(() => {
      const store = usePivotStore.getState();
      store.addFieldToZone(ordersSourceId, '发货区域', 'rows');
      store.addFieldToZone(ordersSourceId, '发货区域', 'columns');
    });

    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.rows).toEqual([]);
    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.columns).toEqual([
      '发货区域',
    ]);
  });

  it('rejects invalid placement for measure fields in dimension-only zones', () => {
    act(() => {
      usePivotStore.getState().addFieldToZone(ordersSourceId, '销售额', 'rows');
    });

    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.rows).toEqual([]);
    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout.measures).toEqual([]);
  });

  it('resets the layout and expanded keys for only the requested source', () => {
    act(() => {
      const store = usePivotStore.getState();
      store.addFieldToZone(ordersSourceId, '发货区域', 'rows');
      store.addFieldToZone(ordersSourceId, '订单年份', 'columns');
      store.addFieldToZone(ordersSourceId, '销售额', 'measures');
      store.addFieldToZone(customersSourceId, '客户等级', 'filters');
      store.setExpandedKeys(ordersSourceId, ['华东']);
      store.setExpandedKeys(customersSourceId, ['华南']);
    });

    act(() => {
      usePivotStore.getState().resetLayout(ordersSourceId);
    });

    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.layout).toEqual({
      rows: [],
      columns: [],
      measures: [],
      filters: [],
    });
    expect(usePivotStore.getState().sourceStates[ordersSourceId]?.expandedKeys).toEqual([]);
    expect(usePivotStore.getState().sourceStates[customersSourceId]?.layout.filters).toEqual([
      '客户等级',
    ]);
    expect(usePivotStore.getState().sourceStates[customersSourceId]?.expandedKeys).toEqual([
      '华南',
    ]);
  });

  it('keeps fixture fields aligned with business row keys', () => {
    expect(orderFields.map((field) => field.key)).toEqual([
      '发货区域',
      '省份',
      '发货城市',
      '订单年份',
      '销售额',
      '销售量',
    ]);
    expect(orderRows[0]).toMatchObject({
      发货区域: '华东',
      省份: '江苏',
      发货城市: '南京',
      订单年份: '2020年',
      销售额: 120000.5,
      销售量: 12,
    });
    expect(orderRows[0]).not.toHaveProperty('region');
    expect(orderRows[0]).not.toHaveProperty('orderPeriod');
    expect(orderRows[0]).not.toHaveProperty('salesAmount');
  });
});
