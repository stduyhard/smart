import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { bootstrapApp } from '../main';
import { logout } from '../services/auth';

function renderRoute(pathname: string) {
  window.history.pushState({}, '', pathname);
  document.body.innerHTML = '<div id="root"></div>';

  act(() => {
    bootstrapApp(document.getElementById('root')!);
  });
}

describe('LoginPage', () => {
  beforeEach(() => {
    logout();
  });

  it('logs in with demo credentials and lands on the data-source heading', async () => {
    renderRoute('/');

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
    expect(window.location.pathname).toBe('/sources');
  });

  it('shows an error when the credentials are invalid', async () => {
    renderRoute('/');

    fireEvent.change(screen.getByLabelText('账号'), {
      target: { value: 'demo' },
    });
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'bad-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    expect(await screen.findByText('账号或密码错误')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });
});
