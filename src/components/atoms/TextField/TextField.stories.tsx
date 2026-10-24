import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'Atoms/TextField',
  component: TextField,
  tags: ['stable'],
  args: { label: 'Họ và tên', autoComplete: 'name' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const WithHint: Story = { args: { label: 'Mã bệnh nhân', hint: 'In ở góc trên phiếu khám' } };
export const WithIcon: Story = { args: { icon: 'ui-user' } };
export const Error: Story = { args: { label: 'Năm sinh', defaultValue: '58', error: 'Nhập năm sinh gồm 4 chữ số, ví dụ 1958' } };
export const Multiline: Story = { args: { label: 'Nội dung', multiline: true, icon: 'pencil-alt-2', hint: 'Không bắt buộc' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Nguyễn Thị Ánh Tuyết' } };
export const LongVietnamese: Story = {
  args: { label: 'Họ và tên người bệnh (ghi đầy đủ, có dấu)', defaultValue: 'Tôn Thất Nguyễn Hoàng Phương Quỳnh', hint: 'ẪỄỖẲỰẬ — dấu phải hiển thị đủ' },
};
