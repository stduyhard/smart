import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { logout } from '../services/auth';
import { routerConfig } from '../router';

function renderRoute(pathname: string) {
  const router = createMemoryRouter(routerConfig, {
    initialEntries: [pathname],
  });

  render(<RouterProvider router={router} />);

  return router;
}

describe('LoginPage', () => {
  beforeEach(() => {
    logout();
  });

  it('logs in with demo credentials and lands on the data-source heading', async () => {
    const router = renderRoute('/');

    fireEvent.change(screen.getByLabelText('账号'), {
      target: { value: 'demo' },
    });
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: '选择数据源' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/sources');
  });

  it('shows an error when the credentials are invalid', async () => {
    const router = renderRoute('/');

    fireEvent.change(screen.getByLabelText('账号'), {
      target: { value: 'demo' },
    });
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'bad-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    expect(await screen.findByText('账号或密码错误')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('redirects unauthenticated users away from the sources route', async () => {
    const router = renderRoute('/sources');

    expect(
      await screen.findByRole('heading', { level: 1, name: '透视分析' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('redirects unauthenticated users away from the pivot route', async () => {
    const router = renderRoute('/pivot/orders');

    expect(
      await screen.findByRole('heading', { level: 1, name: '透视分析' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });
});
