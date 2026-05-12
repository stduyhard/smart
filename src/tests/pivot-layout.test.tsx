import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { orderRows } from '../data/orderModel';
import { usePivotStore } from '../store/pivotStore';

describe('usePivotStore', () => {
  beforeEach(() => {
    act(() => {
      usePivotStore.getState().resetLayout();
    });
  });

  it('adds 发货区域 into the rows layout zone', () => {
    act(() => {
      usePivotStore.getState().addFieldToZone('发货区域', 'rows');
    });

    expect(usePivotStore.getState().layout.rows).toEqual(['发货区域']);
    expect(usePivotStore.getState().layout.columns).toEqual([]);
    expect(usePivotStore.getState().layout.measures).toEqual([]);
    expect(usePivotStore.getState().layout.filters).toEqual([]);
  });

  it('resets the layout and expanded keys', () => {
    act(() => {
      const store = usePivotStore.getState();
      store.addFieldToZone('发货区域', 'rows');
      store.addFieldToZone('订单年份', 'columns');
      store.addFieldToZone('销售额', 'measures');
    });

    usePivotStore.setState({
      ...usePivotStore.getState(),
      expandedKeys: ['华东'],
    });

    act(() => {
      usePivotStore.getState().resetLayout();
    });

    expect(usePivotStore.getState().layout).toEqual({
      rows: [],
      columns: [],
      measures: [],
      filters: [],
    });
    expect(usePivotStore.getState().expandedKeys).toEqual([]);
  });

  it('exposes fixture rows with Chinese business field keys', () => {
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
