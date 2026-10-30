import { render, screen, within } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

it('is a labelled nav whose last item is the current page', () => {
  render(<Breadcrumb items={[{ label: 'Việc của tôi', href: '/' }, { label: 'Rạng Đông KSK 2026', href: '/dot' }, { label: 'Đặng Thanh Chi' }]} />);
  const nav = screen.getByRole('navigation', { name: 'Vị trí' });
  expect(nav).toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(2);
  expect(screen.getByText('Đặng Thanh Chi')).toHaveAttribute('aria-current', 'page');
});

it('ends each item but the last with a hidden separator, so a wrapped line never starts with one', () => {
  render(<Breadcrumb items={[{ label: 'Việc của tôi', href: '/' }, { label: 'Rạng Đông KSK 2026', href: '/dot' }, { label: 'Đặng Thanh Chi' }]} />);
  const items = within(screen.getByRole('list')).getAllByRole('listitem');
  expect(items.map((li) => li.textContent)).toEqual(['Việc của tôi›', 'Rạng Đông KSK 2026›', 'Đặng Thanh Chi']);
  for (const li of items.slice(0, -1)) expect(li.lastElementChild).toHaveAttribute('aria-hidden', 'true');
  expect(items[0].firstElementChild?.tagName).toBe('A');
});

it('marks the parent so a phone can show only the way back', () => {
  render(<Breadcrumb collapseOnPhone items={[{ label: 'Việc của tôi', href: '/' }, { label: 'Rạng Đông KSK 2026', href: '/dot' }, { label: 'Người 6 / 2.033' }]} />);
  expect(screen.getByRole('navigation')).toHaveAttribute('data-collapse', 'true');
  const items = within(screen.getByRole('list')).getAllByRole('listitem');
  expect(items.map((li) => li.hasAttribute('data-parent'))).toEqual([false, true, false]);
});
