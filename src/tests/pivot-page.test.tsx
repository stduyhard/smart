import { act, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { login, logout } from '../services/auth';
import { routerConfig } from '../router';
import { usePivotStore } from '../store/pivotStore';

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
    expect(screen.getByRole('button', { name: '执行查询' })).toBeInTheDocument();
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

  it('renders resolved field metadata from the store and hides empty state when layout has content', async () => {
    await login('demo', '123456');

    act(() => {
      usePivotStore.getState().addFieldToZone('orders', '发货区域', 'rows');
    });

    renderRoute('/pivot/orders');

    const rowsZone = await screen.findByRole('region', { name: '行' });

    expect(within(rowsZone).getByText('发货区域')).toBeInTheDocument();
    expect(within(rowsZone).getByText('D')).toBeInTheDocument();
    expect(screen.queryByLabelText('查询结果空状态')).not.toBeInTheDocument();
  });
});
