import type { Meta, StoryObj } from '@storybook/react';
import { WorkingHours } from './WorkingHours';

const meta = {
  title: 'Molecules/WorkingHours',
  component: WorkingHours,
  args: { rows: [{ label: 'Mùa hè', hours: '07:00–20:00' }, { label: 'Mùa đông', hours: '07:30–20:00' }], note: 'Tất cả các ngày trong tuần' },
} satisfies Meta<typeof WorkingHours>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
