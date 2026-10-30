import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { StatusTag } from '../../atoms/StatusTag';
import { SummaryList } from './SummaryList';

const meta = {
  title: 'Molecules/SummaryList',
  component: SummaryList,
  tags: ['beta'],
  args: {
    rows: [
      { key: 'Dịch vụ', value: 'Khám đa khoa', changeHref: '#' },
      { key: 'Thời gian', value: 'Thứ Bảy, 24 tháng 10, 2026 lúc 09:30', changeHref: '#' },
      { key: 'Người đi khám', value: 'Tôn Thất Nguyễn Hoàng Phương Quỳnh', changeHref: '#' },
      { key: 'Ngày sinh', value: '27/03/1950', changeHref: '#' },
      { key: 'Số điện thoại', value: '0912 345 678', changeHref: '#' },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
} satisfies Meta<typeof SummaryList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ReadOnly: Story = { args: { rows: [{ key: 'Mã đặt lịch', value: 'FDC-2410-0930' }, { key: 'Địa chỉ', value: '75 đường Hồ Mễ Trì, Phường Đại Mỗ, Hà Nội' }] } };

const cell = { padding: 'var(--space-5) var(--space-10)', textAlign: 'left' as const, verticalAlign: 'top' as const };
const results = [
  ['Huyết áp', '150/95 mmHg', <StatusTag key="t" tone="attention" size="sm">Cao</StatusTag>],
  ['Glucose máu', '3,2 mmol/L', <StatusTag key="t" tone="attention" size="sm">Thấp</StatusTag>],
  ['Chiều cao', '162 cm', <StatusTag key="t" tone="muted" size="sm">Nhập tay</StatusTag>],
  ['X-quang tim phổi', 'Bình thường', null],
] as const;
const resultsTable = (
  <table style={{ inlineSize: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ background: 'var(--surface-alt)' }}>
        <th scope="col" style={cell}>Chỉ số</th>
        <th scope="col" style={cell}>Kết quả</th>
        <th scope="col" style={cell}>Ghi chú</th>
      </tr>
    </thead>
    <tbody>
      {results.map(([k, v, tag]) => (
        <tr key={k} style={{ borderBlockStart: '1px solid var(--border)' }}>
          <td style={cell}>{k}</td>
          <td style={cell}>{v}</td>
          <td style={cell}>{tag}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/** Staff review page: each section opens its read-only details right under the row. */
export const WithDetails: Story = {
  args: {
    rows: [
      { key: 'Người khám', value: 'Phạm Văn Nam (TESTA-0007)', changeHref: '#' },
      { key: 'Tiền sử', value: '25 câu · 2 câu trả lời Có', changeHref: '#', details: <p style={{ margin: 0 }}>8. Tăng huyết áp (I10): Có · 14. Đái tháo đường (E11): Có</p>, detailsLabel: 'Xem 25 câu' },
      { key: 'Cận lâm sàng', value: '12 chỉ số và X-quang · 2 chỉ số ngoài khoảng', changeHref: '#', details: resultsTable, detailsLabel: 'Xem 12 chỉ số và X-quang', defaultDetailsOpen: true },
      { key: 'Phân loại', value: 'Loại II', changeHref: '#' },
    ],
  },
};

/** Keyboard: Tab to the toggle, Enter opens the details, Enter again closes them. */
export const DetailsByKeyboard: Story = {
  args: { rows: [{ key: 'Tiền sử', value: '25 câu', details: <p style={{ margin: 0 }}>8. Tăng huyết áp (I10): Có</p>, detailsLabel: 'Xem 25 câu' }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Xem 25 câu' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName('Thu gọn 25 câu');
    await expect(canvas.getByText('8. Tăng huyết áp (I10): Có')).toBeVisible();
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  },
};
