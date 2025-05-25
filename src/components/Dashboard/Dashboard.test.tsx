import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard component')).toBeInTheDocument();
  });
});