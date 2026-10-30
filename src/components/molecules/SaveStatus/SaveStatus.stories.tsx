import type { Meta, StoryObj } from '@storybook/react';
import { SaveStatus } from './SaveStatus';

const meta = {
  title: 'Molecules/SaveStatus',
  component: SaveStatus,
  parameters: { density: 'compact' },
  args: { status: { state: 'unsaved', count: 8, lastSavedAt: '09:12' } },
} satisfies Meta<typeof SaveStatus>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Unsaved: Story = {};
export const Saving: Story = { args: { status: { state: 'saving' } } };
export const Saved: Story = { args: { status: { state: 'saved', at: '09:15' } } };
/** Two people changed the same fields: amber, never the green "Đã lưu", until each value is settled. */
export const Conflict: Story = { args: { status: { state: 'conflict', count: 2, lastSavedAt: '09:12' } } };
/** The network failed: the typed data is kept; "Lưu lại" only tries again. */
export const Failed: Story = { args: { status: { state: 'error', reason: 'mất mạng', count: 8 }, onRetry: () => {} } };

/** All five moments. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <SaveStatus status={{ state: 'unsaved', count: 8, lastSavedAt: '09:12' }} />
      <SaveStatus status={{ state: 'saving' }} />
      <SaveStatus status={{ state: 'saved', at: '09:15' }} />
      <SaveStatus status={{ state: 'conflict', count: 2, lastSavedAt: '09:12' }} />
      <SaveStatus status={{ state: 'error', reason: 'mất mạng', count: 8 }} onRetry={() => {}} />
    </div>
  ),
};
