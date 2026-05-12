import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { login, logout } from '../services/auth';
import { executePivotQuery } from '../services/pivot';
import { exportPivotToExcel } from '../utils/exportExcel';
import { routerConfig } from '../router';
import { usePivotStore } from '../store/pivotStore';

vi.mock('../services/pivot', () => ({
  executePivotQuery: vi.fn(async (_request: any) => ({
    ok: true,
    result: {
      rowHeaders: _request?.layout?.rows?.length > 1
        ? [['华东', '江苏'], ['华东', '上海'], ['华东', '浙江'], ['华东', '合计'], ['华南', '广东'], ['华南', '合计']]
        : [['华东'], ['华南']],
      columnHeaders: [['2020年'], ['2021年']],
      cells: _request?.layout?.rows?.length > 1
        ? {
            '华东|江苏|2020年|销售额': 120000.5,
            '华东|上海|2020年|销售额': 48203.6,
            '华东|浙江|2021年|销售额': 98000,
            '华东|合计|销售额': 266204.1,
            '华南|广东|2020年|销售额': 132500,
            '华南|广东|2021年|销售额': 143300.4,
            '华南|合计|销售额': 275800.4,
            '华东|合计|2020年|销售额': 168204.1,
            '华东|合计|2021年|销售额': 98000,
            '华南|合计|2020年|销售额': 132500,
            '华南|合计|2021年|销售额': 143300.4,
          }
        : {
            '华东|2020年|销售额': 168204.1,
            '华东|2021年|销售额': 98000,
            '华南|2020年|销售额': 132500,
            '华南|2021年|销售额': 143300.4,
          },
    },
  })),
}));

vi.mock('../utils/exportExcel', () => ({
  exportPivotToExcel: vi.fn(),
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
          resolveQuery = () => resolve({ ok: true, result: { rowHeaders: [], columnHeaders: [], cells: {} } });
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
      filters: {},
    });
    expect(screen.getByRole('status')).toHaveTextContent('正在执行透视查询...');
    expect(screen.getByRole('button', { name: '执行查询中...' })).toBeDisabled();

    resolveQuery();

    expect(await screen.findByRole('button', { name: '执行查询' })).toBeEnabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders result table after query completes', async () => {
    await login('demo', '123456');

    renderRoute('/pivot/orders');

    fireEvent.click(await screen.findByRole('button', { name: '添加 发货区域 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 订单年份 到 列' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 销售额 到 度量' }));
    fireEvent.click(screen.getByRole('button', { name: '执行查询' }));

    // After query, result table should appear
    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();

    expect(screen.getByText('华东')).toBeInTheDocument();
    expect(screen.getByText('华南')).toBeInTheDocument();
  });

  it('shows filter controls when a field is placed in the filters zone', async () => {
    await login('demo', '123456');

    renderRoute('/pivot/orders');

    fireEvent.click(await screen.findByRole('button', { name: '添加 省份 到 过滤条件' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 销售额 到 度量' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 发货区域 到 行' }));

    // Filter checkboxes should appear
    expect(await screen.findByText('过滤: 省份')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '江苏' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '上海' })).toBeInTheDocument();
  });

  it('shows expand/collapse toggle on parent rows with subtotals visible', async () => {
    await login('demo', '123456');

    renderRoute('/pivot/orders');

    // Place two row dimensions to get hierarchy
    fireEvent.click(await screen.findByRole('button', { name: '添加 发货区域 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 省份 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 订单年份 到 列' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 销售额 到 度量' }));
    fireEvent.click(screen.getByRole('button', { name: '执行查询' }));

    // Subtotal rows containing "合计" should appear in the result
    const subtotalElements = await screen.findAllByText(/合计/);
    expect(subtotalElements.length).toBeGreaterThan(0);
  });

  it('shows toggle buttons on parent rows for expand/collapse', async () => {
    await login('demo', '123456');

    renderRoute('/pivot/orders');

    fireEvent.click(await screen.findByRole('button', { name: '添加 发货区域 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 省份 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 订单年份 到 列' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 销售额 到 度量' }));
    fireEvent.click(screen.getByRole('button', { name: '执行查询' }));

    await screen.findByRole('table');

    // Expand toggle buttons should exist on parent rows
    const toggleButtons = screen.queryAllByRole('button', { name: '[+]' });
    expect(toggleButtons.length).toBeGreaterThan(0);
  });

  it('exports pivot result to Excel', async () => {
    await login('demo', '123456');

    renderRoute('/pivot/orders');

    fireEvent.click(await screen.findByRole('button', { name: '添加 发货区域 到 行' }));
    fireEvent.click(screen.getByRole('button', { name: '添加 销售额 到 度量' }));
    fireEvent.click(screen.getByRole('button', { name: '执行查询' }));

    // Wait for result table
    await screen.findByRole('table');

    // Export button should be enabled and clickable
    const exportButton = await screen.findByRole('button', { name: '导出 Excel' });
    fireEvent.click(exportButton);

    expect(exportPivotToExcel).toHaveBeenCalled();
  });
});
