import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { login, logout } from '../services/auth';
import { routerConfig } from '../router';

function renderRoute(pathname: string) {
  const router = createMemoryRouter(routerConfig, {
    initialEntries: [pathname],
  });

  render(<RouterProvider router={router} />);

  return router;
}

describe('DataSourcePage', () => {
  beforeEach(() => {
    logout();
  });

  it('loads data sources and navigates to the orders pivot route', async () => {
    await login('demo', '123456');

    const router = renderRoute('/sources');

    expect(await screen.findByText('订单模型')).toBeInTheDocument();
    expect(screen.getByText('客户模型')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '进入订单模型分析' }));

    expect(router.state.location.pathname).toBe('/pivot/orders');
    expect(
      await screen.findByRole('heading', { level: 1, name: '透视分析: orders' }),
    ).toBeInTheDocument();
  });

  it('shows a controlled not-found view for an invalid source id', async () => {
    await login('demo', '123456');

    const router = renderRoute('/pivot/unknown-source');

    expect(
      await screen.findByRole('heading', { level: 1, name: '数据源不存在' }),
    ).toBeInTheDocument();
    expect(screen.getByText('请返回数据源列表并选择有效的业务模型。')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/pivot/unknown-source');
  });
});
