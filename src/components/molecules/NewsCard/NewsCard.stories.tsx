import type { Meta, StoryObj } from '@storybook/react';
import { NewsCard } from './NewsCard';

const meta = {
  title: 'Molecules/NewsCard',
  component: NewsCard,
  args: { href: '#', date: '12/10/2026', title: 'Khám sức khỏe định kỳ cho người cao tuổi', excerpt: 'Những xét nghiệm nên làm mỗi năm sau tuổi 60.' },
  decorators: [(Story) => <div style={{ maxWidth: 280 }}><Story /></div>],
} satisfies Meta<typeof NewsCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
