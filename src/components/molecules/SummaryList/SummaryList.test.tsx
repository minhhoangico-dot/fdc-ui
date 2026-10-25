import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SummaryList } from './SummaryList';

it('names each change link with its row, and calls onChange', async () => {
  const onChange = vi.fn();
  render(<SummaryList rows={[{ key: 'Họ và tên', value: 'Nguyễn Văn Quyết', onChange }, { key: 'Mã', value: 'FDC-1' }]} />);
  const link = screen.getByRole('link', { name: 'Thay đổi họ và tên' });
  await userEvent.click(link);
  expect(onChange).toHaveBeenCalled();
  expect(screen.getAllByRole('link')).toHaveLength(1);
});

describe('SummaryList details', () => {
  const rows = [
    { key: 'Cận lâm sàng', value: '12 chỉ số', details: <p>Huyết áp 150/95 mmHg</p>, detailsLabel: 'Xem 12 chỉ số', changeHref: '/phieu#cls' },
  ];

  it('opens and closes the details with the keyboard, and changes the toggle label', async () => {
    render(<SummaryList rows={rows} />);
    const toggle = screen.getByRole('button', { name: 'Xem 12 chỉ số' });
    const details = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(details).not.toBeVisible();

    await userEvent.tab();
    expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Thu gọn 12 chỉ số');
    expect(toggle).toHaveTextContent('▾');
    expect(details).toBeVisible();
    expect(details).toHaveTextContent('Huyết áp 150/95 mmHg');

    await userEvent.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveTextContent('▸');
    expect(details).not.toBeVisible();
  });

  it('keeps the change link after the toggle in Tab order, and can start open', async () => {
    render(<SummaryList rows={[{ ...rows[0], defaultDetailsOpen: true }]} />);
    expect(screen.getByRole('button', { name: 'Thu gọn 12 chỉ số' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Thay đổi cận lâm sàng' })).toHaveFocus();
  });

  it('rows without details have no toggle (the v2 list is unchanged)', () => {
    render(<SummaryList rows={[{ key: 'Mã', value: 'FDC-1' }]} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

