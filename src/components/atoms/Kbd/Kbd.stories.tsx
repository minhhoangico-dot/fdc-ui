import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta = {
  title: 'Atoms/Kbd',
  component: Kbd,
  args: { keys: ['Ctrl', 'S'] },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Combination: Story = {};
export const SingleKey: Story = { args: { keys: undefined, children: 'Esc' } };

/** The hint goes where the shortcut works, in words first. */
export const InAHint: Story = {
  render: () => (
    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>
      Phím tắt: <Kbd keys={['Ctrl', 'S']} /> lưu · <Kbd keys={['Ctrl', 'Enter']} /> mở trang Xem lại trước khi gửi
    </p>
  ),
};
