import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ServiceAccordion } from './ServiceAccordion';

const meta = {
  title: 'Molecules/ServiceAccordion',
  component: ServiceAccordion,
  args: {
    items: [
      { title: 'Phục hồi chức năng trọn gói', content: 'Giúp phục hồi tối đa sức khỏe và khả năng sinh hoạt, đặc biệt sau khi xuất viện.', href: '#' },
      { title: 'Dưỡng lão trọn gói', content: 'Chăm sóc toàn diện về sức khỏe và tinh thần cho người cao tuổi.', href: '#', moreLabel: 'Xem bảng giá' },
      { title: 'Y học cổ truyền', content: 'Châm cứu, xoa bóp bấm huyệt kết hợp điều trị.' },
    ],
  },
} satisfies Meta<typeof ServiceAccordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AllClosed: Story = { args: { defaultOpen: -1 } };
export const OpensOnClick: Story = {
  args: { defaultOpen: -1 },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /Y học cổ truyền/ });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};
