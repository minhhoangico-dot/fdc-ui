import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  args: { label: 'Tôi đã xem phần nhập tay' },
  parameters: { density: 'compact' },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Tab to the box, Space ticks it; a click anywhere on the label row does too. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox');
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
  },
};

export const Checked: Story = { args: { defaultChecked: true } };

/** The hint says what was checked, lined up with the label text. */
export const WithHint: Story = { args: { hint: '1 kết quả nhập tay: X-quang tim phổi' } };

/** After "Gửi lên Sở" without the tick: one message, one red bar. */
export const Error: Story = {
  args: { hint: '1 kết quả nhập tay: X-quang tim phổi', error: 'Tích “Tôi đã xem phần nhập tay” để gửi' },
};

export const Disabled: Story = { args: { disabled: true, hint: 'Đang gửi lên Sở, không sửa được' } };

/** Long Vietnamese wraps under itself; the box stays on the first line. */
export const LongLabel: Story = {
  args: {
    label: 'Tôi đã đối chiếu kết quả X-quang tim phổi và điện tâm đồ nhập tay với phiếu giấy của Tôn Nữ Hoàng Bảo Ngọc Phương Thảo',
    hint: '2 kết quả nhập tay: X-quang tim phổi, điện tâm đồ',
  },
};

/** Patients and families: comfortable density, 18px text. */
export const Comfortable: Story = {
  parameters: { density: 'comfortable' },
  args: { label: 'Nhắc tôi trước giờ khám 1 ngày', hint: 'Gửi tin nhắn tới số điện thoại bạn đã nhập' },
};
