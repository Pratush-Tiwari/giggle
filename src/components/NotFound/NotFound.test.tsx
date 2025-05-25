import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('renders correctly', () => {
    render(<NotFound />);
    expect(screen.getByText('NotFound component')).toBeInTheDocument();
  });
});