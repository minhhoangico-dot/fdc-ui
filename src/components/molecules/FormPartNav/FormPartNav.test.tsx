import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormPartNav, type FormPartNavItem } from './FormPartNav';

const parts = (onSelect = () => {}): FormPartNavItem[] => [
  { label: '1. Hành chính', href: '#hanh-chinh', done: true },
  { label: '3. Tiền sử', count: 'còn 17', onSelect },
  { label: '4. Thể lực', count: 'còn 2', current: true },
  { label: '6. Cận lâm sàng', href: '#can-lam-sang', done: true, sub: '12 chỉ số từ HIS, 09:12' },
];

it('shows the current part on the toggle, which opens and closes the list', async () => {
  render(<FormPartNav items={parts()} />);
  const toggle = screen.getByRole('button', { name: '4. Thể lực · còn 2' });
  const list = screen.getByRole('list');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveAttribute('aria-controls', list.id);
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(list.closest('[data-component="FormPartNav"]')).toHaveAttribute('data-open');
  await userEvent.keyboard('{Escape}');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
});

it('marks only the current part as the step, and done parts read "Đủ"', () => {
  render(<FormPartNav items={parts()} />);
  const current = screen.getByRole('button', { current: 'step' });
  expect(current).toHaveTextContent('4. Thể lực còn 2');
  expect(current).not.toHaveAttribute('aria-expanded');
  expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);
  const done = screen.getByRole('link', { name: /6\. Cận lâm sàng/ });
  expect(done).toHaveTextContent('12 chỉ số từ HIS, 09:12');
  expect(done.querySelector('[data-done]')).toHaveTextContent('Đủ');
  expect(screen.getAllByRole('listitem')).toHaveLength(4);
});

it('closes after choosing a part and gives focus back to the toggle', async () => {
  const onSelect = vi.fn();
  render(<FormPartNav items={parts(onSelect)} />);
  const toggle = screen.getByRole('button', { name: '4. Thể lực · còn 2' });
  await userEvent.click(toggle);
  await userEvent.click(screen.getByRole('button', { name: /3\. Tiền sử/ }));
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();

  await userEvent.click(toggle);
  await userEvent.click(screen.getByRole('link', { name: /1\. Hành chính/ }));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

it('repeats a part to fix on the closed toggle, in words', () => {
  const items = parts();
  items[1] = { ...items[1], problem: '1 cần sửa' };
  render(<FormPartNav items={items} />);
  expect(screen.getByRole('button', { expanded: false })).toHaveTextContent('3. Tiền sử: 1 cần sửa');
  expect(screen.getByRole('button', { name: /^3\. Tiền sử/ })).toHaveAttribute('data-problem', 'true');
});

it('takes its own toggle text', () => {
  render(<FormPartNav items={parts()} toggleLabel="Phần 4 / 7: Thể lực" />);
  expect(screen.getByRole('button', { name: 'Phần 4 / 7: Thể lực' })).toHaveAttribute('aria-expanded', 'false');
});
