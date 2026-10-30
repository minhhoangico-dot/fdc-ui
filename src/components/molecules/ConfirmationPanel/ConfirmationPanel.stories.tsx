import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { Inline } from '../../layout/Inline';
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

/**
 * Pressed but not finished: pale status-info with an "i", never green. The title is a fixed "Chờ gửi lên Sở": a focused
 * title keeps one name, so the countdown goes in the text under it ("Còn 27 giây để hủy."). Done steps say what
 * happened, the step being waited for says "Chờ …" with a small clock in the info blue, later steps are plain event names.
 */
export const Pending: Story = {
  parameters: { density: 'compact' },
  args: {
    tone: 'pending',
    title: 'Chờ gửi lên Sở',
    reference: undefined,
    headingLevel: 2,
    steps: [
      { label: 'Đã xem lại', state: 'done' },
      { label: 'Chờ gửi', state: 'current' },
      { label: 'Sở tiếp nhận', state: 'todo' },
      { label: 'Bộ xác nhận', state: 'todo' },
    ],
    children: (
      <p>
        <strong>Còn 27 giây để hủy.</strong> Chưa có gì lên Sở. Chị có thể hủy.
      </p>
    ),
  },
};

/**
 * Sở đã tiếp nhận, on a staff screen: subtle, a pale green panel with a "✓", the department's receipt code in a white
 * box (it never wraps; in a narrow column it gets a little smaller) and the explanation inside. The ministry has not
 * confirmed yet, so "Chờ Bộ xác nhận" is the step being waited for: a clock in the info blue, never a finished look.
 */
export const SoDaTiepNhan: Story = {
  name: 'Sở đã tiếp nhận',
  parameters: { density: 'compact' },
  args: {
    emphasis: 'subtle',
    title: 'Sở đã tiếp nhận',
    reference: 'SYT-HN-2026-118204',
    referenceLabel: 'Mã tiếp nhận của Sở',
    headingLevel: 2,
    // Explicit states from real events: the department's receipt is in, the ministry's is not yet.
    steps: [
      { label: 'Đã xem lại', state: 'done' },
      { label: 'Đã gửi lên Sở', state: 'done' },
      { label: 'Sở đã tiếp nhận', state: 'done' },
      { label: 'Chờ Bộ xác nhận', state: 'current' },
    ],
    children: <p>Bộ Y tế chưa xác nhận. Khi Bộ xác nhận, trạng thái đổi thành “Bộ đã xác nhận”; chị không cần làm gì thêm.</p>,
  },
};

/** The strong patient panel with a step line: done steps carry "✓", the step still waited for a white clock. */
export const SuccessWithSteps: Story = {
  args: {
    steps: [
      { label: 'Đã đặt lịch', state: 'done' },
      { label: 'Chờ phòng khám gọi', state: 'current' },
      { label: 'Đến khám', state: 'todo' },
    ],
  },
};

/**
 * Bị từ chối: the department refused and gave a reason. Error tone with "!", the reason in the department's words,
 * the button that opens the part to fix, and the way back after the fix: sửa, xem lại, gửi lại. Only a refusal
 * with a reason opens the record for a resend.
 */
export const BiTuChoi: Story = {
  name: 'Bị từ chối',
  parameters: { density: 'compact' },
  args: {
    tone: 'error',
    title: 'Bị từ chối',
    reference: undefined,
    headingLevel: 2,
    steps: [
      { label: 'Đã gửi lên Sở', state: 'done' },
      { label: 'Sở từ chối', state: 'failed' },
      { label: 'Chờ chị sửa', state: 'current' },
      { label: 'Xem lại', state: 'todo' },
      { label: 'Gửi lại', state: 'todo' },
    ],
    children: (
      <>
        <p>Sở trả lại hồ sơ lúc 09:32. Lý do của Sở: “Thiếu kết luận phân loại sức khỏe”. Chưa có gì được ghi nhận.</p>
        <p>Sau khi sửa và lưu, hồ sơ chuyển sang nhóm Sẵn sàng xem lại: chị xem lại rồi gửi lại.</p>
        <Inline gap={10}>
          <Button variant="primary" href="#phan-7-ket-luan">
            Mở phần 7. Kết luận để sửa
          </Button>
          <Button>Nhờ Minh kiểm tra</Button>
        </Inline>
      </>
    ),
  },
};

/**
 * Chưa rõ kết quả: sent, but the department has not answered. Attention tone (amber, "!"). The department may
 * already hold the record, so the actions are a status check and asking Minh: never "Gửi lại", which would make a
 * duplicate. The record stays in the Đang gửi group until the answer comes.
 */
export const ChuaRoKetQua: Story = {
  name: 'Chưa rõ kết quả',
  parameters: { density: 'compact' },
  args: {
    tone: 'attention',
    title: 'Chưa rõ kết quả',
    reference: undefined,
    headingLevel: 2,
    steps: [
      { label: 'Đã xem lại', state: 'done' },
      { label: 'Đã gửi lên Sở', state: 'done' },
      { label: 'Chờ Sở trả lời', state: 'current' },
      { label: 'Bộ xác nhận', state: 'todo' },
    ],
    children: (
      <>
        <p>Đã gửi lúc 09:31 nhưng Sở chưa trả lời sau 10 phút. Sở có thể đã nhận hồ sơ, nên chưa gửi lại để tránh gửi trùng.</p>
        <p>Hồ sơ vẫn ở nhóm Đang gửi cho đến khi Sở trả lời.</p>
        <Inline gap={10}>
          <Button variant="primary">Kiểm tra lại trạng thái</Button>
          <Button>Nhờ Minh kiểm tra</Button>
        </Inline>
      </>
    ),
  },
};
