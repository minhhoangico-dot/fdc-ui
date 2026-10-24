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

export const Neutral: Story = { args: { children: 'Gửi thông tin' } };
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
