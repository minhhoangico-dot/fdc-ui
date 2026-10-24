import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { Inline } from './Inline';

const meta = {
  title: 'Layout/Inline',
  component: Inline,
  args: { gap: 10 },
  render: (args) => (
    <Inline {...args}>
      <Button>Quay lại</Button>
      <Button variant="primary">Tiếp tục</Button>
    </Inline>
  ),
} satisfies Meta<typeof Inline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SpaceBetween: Story = { args: { justify: 'between' } };
