import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { TextLink } from './TextLink';

const meta = {
  title: 'Atoms/TextLink',
  component: TextLink,
  args: { href: '#' },
} satisfies Meta<typeof TextLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Specific: Story = { args: { children: 'Xem bảng giá dịch vụ' } };

/**
 * Staff forms: moving between parts ("‹ 3. Tiền sử", "5. Lâm sàng ›") and a plain "Đăng xuất". The chevrons are
 * hidden from screen readers, so each link's name is only its words; Tab shows the 3px focus ring.
 */
export const BackNextAndPlain: Story = {
  parameters: { density: 'compact' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 'var(--space-15)' }}>
      <TextLink href="#tien-su" arrow="back">
        3. Tiền sử
      </TextLink>
      <TextLink href="#lam-sang" arrow="next">
        5. Lâm sàng
      </TextLink>
      <TextLink href="#dang-xuat" arrow={false}>
        Đăng xuất
      </TextLink>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const back = canvas.getByRole('link', { name: '3. Tiền sử' });
    await expect(back.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    await expect(canvas.getByRole('link', { name: '5. Lâm sàng' }).lastElementChild?.tagName.toLowerCase()).toBe('svg');
    await expect(canvas.getByRole('link', { name: 'Đăng xuất' }).querySelector('svg')).toBeNull();
    await userEvent.tab();
    await expect(back).toHaveFocus();
    await expect(getComputedStyle(back).outlineWidth).toBe('3px');
  },
};
