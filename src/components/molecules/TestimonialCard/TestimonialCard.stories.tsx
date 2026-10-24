import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialCard } from './TestimonialCard';

const meta = {
  title: 'Molecules/TestimonialCard',
  component: TestimonialCard,
  args: { quote: 'Nơi đây đúng là ngôi nhà thứ hai của đời mình, thật thân thiện và ấm áp', name: 'Cụ Hòa', role: 'Người cao tuổi tại viện' },
  decorators: [(Story) => <div style={{ maxWidth: 320, background: 'var(--brand-200)', padding: 'var(--space-20)' }}><Story /></div>],
} satisfies Meta<typeof TestimonialCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
