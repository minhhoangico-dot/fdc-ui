import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  args: { name: 'Bùi Hiền', size: 64 },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const Ringed: Story = { args: { name: 'Hoàng Tuyên', size: 96, ring: true } };
export const Small: Story = { args: { name: 'Nguyễn Minh Trân', size: 40 } };
