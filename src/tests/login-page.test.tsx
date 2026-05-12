import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App bootstrap', () => {
  it('renders the default login page heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: '透视分析' }),
    ).toBeInTheDocument();
  });
});
