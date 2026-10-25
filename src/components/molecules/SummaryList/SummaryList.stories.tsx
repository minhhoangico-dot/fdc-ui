import type { Meta, StoryObj } from '@storybook/react';
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
