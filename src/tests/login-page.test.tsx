import { act } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bootstrapApp } from '../main';

describe('App bootstrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.resetModules();
  });

  it('renders the default login page heading through the bootstrap helper', () => {
    act(() => {
      bootstrapApp(document.getElementById('root')!);
    });

    expect(
      screen.getByRole('heading', { level: 1, name: '透视分析' }),
    ).toBeInTheDocument();
  });

  it('mounts the default login page from the main entry point', async () => {
    await act(async () => {
      await import('../main');
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: '透视分析' }),
      ).toBeInTheDocument();
    });
  });
});
