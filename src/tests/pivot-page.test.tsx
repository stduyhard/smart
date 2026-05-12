import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { login, logout } from '../services/auth';
import { executePivotQuery } from '../services/pivot';
import { routerConfig } from '../router';
import { usePivotStore } from '../store/pivotStore';

vi.mock('../services/pivot', () => ({
  executePivotQuery: vi.fn(async () => ({ ok: true })),
}));

function renderRoute(pathname: string) {
  const router = createMemoryRouter(routerConfig, {
    initialEntries: [pathname],
  });

  render(<RouterProvider router={router} />);

  return router;
}

describe('PivotPage', () => {
  beforeEach(() => {
    logout();
    act(() => {
      usePivotStore.setState((state) => ({
        ...state,
        sourceStates: {},
      }));
    });
  });

  it('renders the pivot shell with field panel, zones, settings, and empty state', async () => {
    await login('demo', '123456');

    const router = renderRoute('/pivot/orders');

    expect(
      await screen.findByRole('heading', { level: 1, name: '透视分析: orders' }),
    ).toBeInTheDocument();
    expect(screen.getByText('当前数据源')).toBeInTheDocument();
    expect(screen.getByText('订单模型')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '执行查询' })).toBeDisabled();
    expect(screen.getByRole('heading', { level: 2, name: '字段列表' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '布局区' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '行' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '列' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '度量' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '过滤条件' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '设置' })).toBeInTheDocument();
    expect(screen.getByText('拖拽字段到行、列、度量和过滤条件后开始查询。')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/pivot/orders');
  });

  it('places fields from the panel into rows, columns, measures, and filters, then enables query', async () => {
    await login('demo', '123456');

    renderRoute('/pivot/orders');

    fireEvent.click(await screen.findByRole('button', { name: '添加 发货区域 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 订单年份 到 列' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 省份 到 过滤条件' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 销售额 到 度量' }));

    const rowsZone = screen.getByRole('region', { name: '行' });
    const columnsZone = screen.getByRole('region', { name: '列' });
    const measuresZone = screen.getByRole('region', { name: '度量' });
    const filtersZone = screen.getByRole('region', { name: '过滤条件' });

    expect(within(rowsZone).getByText('发货区域')).toBeInTheDocument();
    expect(within(columnsZone).getByText('订单年份')).toBeInTheDocument();
    expect(within(measuresZone).getByText('销售额')).toBeInTheDocument();
    expect(within(filtersZone).getByText('省份')).toBeInTheDocument();
    expect(within(rowsZone).getByText('D')).toBeInTheDocument();
    expect(within(columnsZone).getByText('D')).toBeInTheDocument();
    expect(within(measuresZone).getByText('M')).toBeInTheDocument();
    expect(within(filtersZone).getByText('D')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '执行查询' })).toBeEnabled();
    expect(screen.queryByLabelText('查询结果空状态')).not.toBeInTheDocument();
  });

  it('shows loading state and calls the pivot query service when executing a ready layout', async () => {
    await login('demo', '123456');

    let resolveQuery!: () => void;
    vi.mocked(executePivotQuery).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveQuery = () => resolve({ ok: true });
        }),
    );

    renderRoute('/pivot/orders');

    fireEvent.click(await screen.findByRole('button', { name: '添加 发货区域 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 销售额 到 度量' }));
    fireEvent.click(screen.getByRole('button', { name: '执行查询' }));

    expect(executePivotQuery).toHaveBeenCalledWith({
      sourceId: 'orders',
      layout: {
        rows: ['发货区域'],
        columns: [],
        measures: ['销售额'],
        filters: [],
      },
    });
    expect(screen.getByRole('status')).toHaveTextContent('正在执行透视查询...');
    expect(screen.getByRole('button', { name: '执行查询中...' })).toBeDisabled();

    resolveQuery();

    expect(await screen.findByRole('button', { name: '执行查询' })).toBeEnabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
