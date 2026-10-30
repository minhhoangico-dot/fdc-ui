import type { Meta, StoryObj } from '@storybook/react';
import { FormNotice } from './FormNotice';

const meta = {
  title: 'Molecules/FormNotice',
  component: FormNotice,
  args: { notice: { type: 'success', text: 'Đã gửi. Chúng tôi sẽ gọi lại cho bạn trong 30 phút.' } },
} satisfies Meta<typeof FormNotice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};
export const Error: Story = { args: { notice: { type: 'error', text: 'Chúng tôi chưa gửi được. Vui lòng thử lại hoặc gọi 024 35 430 430.' } } };
export const Warning: Story = { args: { notice: { type: 'warning', text: 'Hồ sơ này còn 3 mục còn thiếu.' } } };
export const Info: Story = { args: { notice: { type: 'info', text: 'Muốn đổi giờ khám, bạn gọi 024 35 430 430.' } } };

/**
 * A notice that stands on its own in a page: a pale tint in the type's color, the sign and the words; no edge and
 * no side bar. The circle with "!", "i" or "✓" tells the types apart without color, also next to the nursing-home
 * orange. The send results use the record-state words: a refusal gives the department's reason; an unknown outcome
 * says to check first and never offers "Gửi lại".
 */
export const Boxed: Story = {
  parameters: { density: 'compact' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-15)', maxWidth: '40rem' }}>
      <FormNotice boxed notice={{ type: 'warning', text: 'Hồ sơ này còn 3 mục còn thiếu. Điền đủ trước khi xem lại.' }} />
      <FormNotice
        boxed
        notice={{ type: 'error', text: 'Bị từ chối: Sở trả lại hồ sơ lúc 09:32. Lý do của Sở: “Thiếu kết luận phân loại sức khỏe”.' }}
      />
      <FormNotice
        boxed
        notice={{
          type: 'warning',
          text: 'Chưa rõ kết quả: Sở chưa trả lời sau 10 phút. Sở có thể đã nhận hồ sơ: kiểm tra lại trạng thái, chưa gửi lại.',
        }}
      />
      <FormNotice boxed notice={{ type: 'success', text: 'Sở đã tiếp nhận 41 hồ sơ của đợt Rạng Đông KSK 2026.' }} />
      <FormNotice boxed notice={{ type: 'info', text: 'Đã hủy gửi. Chưa có gì lên Sở; hồ sơ mở lại để chị sửa.' }} />
    </div>
  ),
};
