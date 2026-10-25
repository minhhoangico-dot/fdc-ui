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
