import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('renders correctly', () => {
    render(<Sidebar />);
    expect(screen.getByText('Sidebar component')).toBeInTheDocument();
  });
});
