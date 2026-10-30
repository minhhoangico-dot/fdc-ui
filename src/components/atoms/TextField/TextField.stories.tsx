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
/** A computed value shown in place: grey fill and a light edge, so it does not look like a field to type in. */
export const ReadOnly: Story = {
  parameters: { density: 'compact' },
  args: { label: 'BMI', readOnly: true, value: '24,1', unit: 'kg/m²', hint: 'Tự tính từ chiều cao và cân nặng', autoComplete: 'off' },
};
/**
 * One stable message line (`reserve`): the hint, and later the error, share one line that keeps the room of the
 * longest text it may show, so the box does not move when the page sets or clears the error or the hint goes.
 * NumberField works this way; a page can use it for a required text field such as "Lời khuyên".
 */
export const OneMessageLine: Story = {
  parameters: { density: 'compact' },
  args: {
    label: 'Lời khuyên',
    hint: 'Chưa điền · ví dụ “Đo lại huyết áp sau 1 tháng”',
    reserve: ['Chưa điền · ví dụ “Đo lại huyết áp sau 1 tháng”', { error: 'Điền lời khuyên' }],
    autoComplete: 'off',
  },
};
/** The same field after "Xem lại" with nothing typed: the error takes the hint's place, the box stays where it was. */
export const OneMessageLineError: Story = {
  parameters: { density: 'compact' },
  args: { ...OneMessageLine.args, label: 'Lời khuyên', required: true, error: 'Điền lời khuyên' },
};
export const LongVietnamese: Story = {
  args: { label: 'Họ và tên người bệnh (ghi đầy đủ, có dấu)', defaultValue: 'Tôn Thất Nguyễn Hoàng Phương Quỳnh', hint: 'ẪỄỖẲỰẬ — dấu phải hiển thị đủ' },
};
