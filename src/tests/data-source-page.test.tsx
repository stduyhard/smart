import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { bootstrapApp } from '../main';
import { login, logout } from '../services/auth';

function renderRoute(pathname: string) {
  window.history.pushState({}, '', pathname);
  document.body.innerHTML = '<div id="root"></div>';

  act(() => {
    bootstrapApp(document.getElementById('root')!);
  });
}

describe('DataSourcePage', () => {
  beforeEach(() => {
    logout();
  });

  it('loads data sources and navigates to the orders pivot route', async () => {
    await login('demo', '123456');

    renderRoute('/sources');

    expect(await screen.findByText('订单模型')).toBeInTheDocument();
    expect(screen.getByText('客户模型')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '进入订单模型分析' }));

    expect(window.location.pathname).toBe('/pivot/orders');
    expect(
      await screen.findByRole('heading', { level: 1, name: '透视分析: orders' }),
    ).toBeInTheDocument();
  });
});
