import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  parameters: { density: 'compact' },
  args: {
    items: [
      { label: 'Việc của tôi', href: '#' },
      { label: 'Rạng Đông KSK 2026', href: '#' },
      { label: 'Tôn Nữ Hoàng Bảo Ngọc Phương Thảo', href: '#' },
      { label: 'Xem lại trước khi gửi' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Long names wrap onto a second line instead of pushing the page sideways. */
export const Default: Story = {};
