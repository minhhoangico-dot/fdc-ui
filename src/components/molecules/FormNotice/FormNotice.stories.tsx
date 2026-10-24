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
