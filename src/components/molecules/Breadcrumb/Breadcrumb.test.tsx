import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

it('is a labelled nav whose last item is the current page', () => {
  render(<Breadcrumb items={[{ label: 'Việc của tôi', href: '/' }, { label: 'Rạng Đông KSK 2026', href: '/dot' }, { label: 'Đặng Thanh Chi' }]} />);
  const nav = screen.getByRole('navigation', { name: 'Vị trí' });
  expect(nav).toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(2);
  expect(screen.getByText('Đặng Thanh Chi')).toHaveAttribute('aria-current', 'page');
});
