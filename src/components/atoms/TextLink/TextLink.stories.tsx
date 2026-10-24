import type { Meta, StoryObj } from '@storybook/react';
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
