import type { Meta, StoryObj } from '@storybook/react';
import { HotlineCard } from './HotlineCard';

const meta = {
  title: 'Molecules/HotlineCard',
  component: HotlineCard,
  tags: ['stable'],
  args: { number: '024 35 430 430' },
} satisfies Meta<typeof HotlineCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {};
export const Framed: Story = {
  args: { variant: 'framed', label: 'Hotline 24/7', number: '096 583 7777', note: 'Viện điều dưỡng FDC' },
  decorators: [(Story) => <div style={{ maxWidth: 320, paddingTop: 'var(--space-15)' }}><Story /></div>],
};
