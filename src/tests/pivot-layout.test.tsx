import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
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
});
