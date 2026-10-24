import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceAccordion } from './ServiceAccordion';

it('opens one panel at a time with aria-expanded', async () => {
  render(<ServiceAccordion items={[{ title: 'A', content: 'Nội dung A' }, { title: 'B', content: 'Nội dung B' }]} />);
  const [a, b] = screen.getAllByRole('button');
  expect(a).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(b);
  expect(b).toHaveAttribute('aria-expanded', 'true');
  expect(a).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText('Nội dung B')).toBeVisible();
});
