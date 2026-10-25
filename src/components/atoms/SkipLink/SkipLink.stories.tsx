import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from './SkipLink';

const meta = {
  title: 'Atoms/SkipLink',
  component: SkipLink,
  parameters: { docs: { description: { component: 'Press Tab once to see it.' } } },
  render: (args) => (
    <div style={{ position: 'relative', minHeight: 120 }}>
      <SkipLink {...args} />
      <p>Nhấn Tab để thấy liên kết.</p>
      <main id="main" tabIndex={-1}>Nội dung chính</main>
    </div>
  ),
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
