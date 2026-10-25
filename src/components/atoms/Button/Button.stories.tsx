import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['stable'],
  args: { children: 'Đặt lịch khám', onClick: fn() },
  argTypes: { variant: { control: 'inline-radio', options: ['neutral', 'primary', 'hotline'] } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { name: 'Neutral (secondary)', args: { children: 'Quay lại phiếu' } };
export const Primary: Story = { args: { variant: 'primary' } };
export const Hotline: Story = { args: { variant: 'hotline', icon: 'phone', href: 'tel:02435430430', children: '024 35 430 430' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };
export const Loading: Story = { args: { variant: 'primary', loading: true } };
export const Block: Story = { args: { variant: 'primary', block: true } };
export const LongLabel: Story = {
  args: { variant: 'primary', children: 'Xác nhận và gửi yêu cầu khám tại nhà cho người thân của tôi' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const KeyboardActivates: Story = {
  args: { variant: 'primary' },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Đặt lịch khám' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};

/** Staff tools: one primary, a white secondary, and an unavailable action that says why. */
export const ScreenState: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-15)', alignItems: 'center' }}>
      <Button icon="simple-left">Quay lại phiếu</Button>
      <Button {...args} variant="primary" disabledReason="Chọn một dòng ở trên trước.">
        Dùng người và lượt khám này
      </Button>
    </div>
  ),
};

/** Tab still reaches an unavailable button with a reason; it reads the reason and ignores clicks. */
export const DisabledWithReason: Story = {
  args: { variant: 'primary', children: 'Gửi lên Sở', disabledReason: 'Còn 3 mục còn thiếu.' },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Gửi lên Sở' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toHaveAccessibleDescription('Còn 3 mục còn thiếu.');
    await userEvent.keyboard('{Enter}');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
