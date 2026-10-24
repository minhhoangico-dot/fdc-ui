import type { Meta, StoryObj } from '@storybook/react';
import { SpecialtyTile } from './SpecialtyTile';

const meta = {
  title: 'Molecules/SpecialtyTile',
  component: SpecialtyTile,
  args: { title: 'Khoa nhi', icon: 'ui-user', href: '#' },
  decorators: [(Story) => <div style={{ maxWidth: 360, background: 'var(--surface-alt)', padding: 'var(--space-15)' }}><Story /></div>],
} satisfies Meta<typeof SpecialtyTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongName: Story = { args: { title: 'Khám chữa bệnh tại nhà cho người cao tuổi' } };
