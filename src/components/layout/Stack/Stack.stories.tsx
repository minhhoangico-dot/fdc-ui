import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: { gap: 15 },
  render: (args) => (
    <Stack {...args}>
      <Button variant="primary">Đặt lịch khám</Button>
      <Button>Tra cứu kết quả</Button>
      <Button variant="hotline" href="tel:02435430430" icon="phone">024 35 430 430</Button>
    </Stack>
  ),
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Wide: Story = { args: { gap: 40 } };
export const Centered: Story = { args: { align: 'center' } };
