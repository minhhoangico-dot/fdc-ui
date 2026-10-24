import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from './PhoneInput';

const meta = {
  title: 'Molecules/PhoneInput',
  component: PhoneInput,
  tags: ['beta'],
  args: { required: true },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof PhoneInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { icon: 'phone' } };
export const Error: Story = { args: { defaultValue: '091234', error: 'Nhập số điện thoại gồm 10 chữ số, ví dụ 0912 345 678' } };
