import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IdleTimeoutDialog } from './IdleTimeoutDialog';

const meta = {
  title: 'Organisms/IdleTimeoutDialog',
  component: IdleTimeoutDialog,
  tags: ['beta'],
  parameters: { docs: { description: { component: 'Demo: warns after 5 seconds of no activity, times out after 65 seconds.' } } },
  args: { timeoutMs: 65_000, warnBeforeMs: 60_000, onTimeout: () => {} },
  render: (args) => {
    const [ended, setEnded] = useState(false);
    return ended ? (
      <p role="status">Phiên đã kết thúc. Thông tin bạn nhập đã được lưu nháp.</p>
    ) : (
      <>
        <p>Đứng yên 5 giây để thấy cảnh báo.</p>
        <IdleTimeoutDialog {...args} onTimeout={() => setEnded(true)} />
      </>
    );
  },
} satisfies Meta<typeof IdleTimeoutDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
