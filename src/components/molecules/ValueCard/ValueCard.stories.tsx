import type { Meta, StoryObj } from '@storybook/react';
import { ValueCard } from './ValueCard';

const meta = {
  title: 'Molecules/ValueCard',
  component: ValueCard,
  args: { title: 'F – Family', children: 'Người cao tuổi như người cha, người mẹ thứ hai. Viện là ngôi nhà, là gia đình thứ hai của các Cụ.' },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
} satisfies Meta<typeof ValueCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
