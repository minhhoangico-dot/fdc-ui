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

/** A notice that stands on its own in a page: 1px edge, 6px bar in the type's color. */
export const Boxed: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-15)', maxWidth: '40rem' }}>
      <FormNotice boxed notice={{ type: 'warning', text: 'Hồ sơ này còn 3 mục còn thiếu. Điền đủ trước khi gửi lên Sở.' }} />
      <FormNotice boxed notice={{ type: 'error', text: 'Chưa gửi được lên Sở. Kiểm tra mạng rồi bấm Gửi lại.' }} />
      <FormNotice boxed notice={{ type: 'success', text: 'Đã gửi 41 hồ sơ lên Sở.' }} />
      <FormNotice boxed notice={{ type: 'info', text: 'Hệ thống tự gửi lúc 17:00 mỗi ngày.' }} />
    </div>
  ),
};
