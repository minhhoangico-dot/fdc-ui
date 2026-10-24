import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { iconNames } from './icons';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['stable'],
  args: { name: 'phone', size: 24 },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithTitle: Story = { args: { title: 'Gọi điện' } };
export const AllGlyphs: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: 'var(--space-15)' }}>
      {iconNames.map((n) => (
        <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--brand-600)' }}><Icon name={n} size={28} /></span>
          {n}
        </div>
      ))}
    </div>
  ),
};
