import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationPanel } from './ConfirmationPanel';

const meta = {
  title: 'Molecules/ConfirmationPanel',
  component: ConfirmationPanel,
  tags: ['beta'],
  args: {
    title: 'Đã đặt lịch khám',
    reference: 'FDC-2410-0930',
    focusOnMount: false,
    children: (
      <>
        <h2>Tiếp theo</h2>
        <p>Chúng tôi sẽ gọi số 0912 345 678 trong vòng 30 phút để xác nhận lịch.</p>
        <p>Muốn đổi hoặc hủy lịch, hãy gọi 024 35 430 430 và đọc mã đặt lịch.</p>
      </>
    ),
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof ConfirmationPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
