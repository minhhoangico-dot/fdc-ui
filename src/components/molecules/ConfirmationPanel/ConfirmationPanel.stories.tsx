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

const sendSteps = ['Chờ gửi', 'Đang gửi', 'Đã gửi lên Sở', 'Bộ đã nhận'];

/** Pressed but not finished: pale status-info, never green. The step line shows where it is. */
export const Pending: Story = {
  args: {
    tone: 'pending',
    title: 'Chờ gửi · còn 27 giây',
    reference: undefined,
    headingLevel: 2,
    steps: sendSteps,
    currentStep: 0,
    children: <p>Hồ sơ chưa được gửi. Chị có thể hủy.</p>,
  },
};

/** Done, with the same step line: the current step is the last one reached. */
export const SuccessWithSteps: Story = {
  args: {
    title: 'Đã gửi lên Sở',
    reference: 'HS-2610-0412',
    referenceLabel: 'Mã hồ sơ',
    headingLevel: 2,
    steps: sendSteps,
    currentStep: 2,
    children: <p>Bộ Y tế thường nhận trong 1 giờ. Trạng thái tự cập nhật trên trang Việc của tôi.</p>,
  },
};
