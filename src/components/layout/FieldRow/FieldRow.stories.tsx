import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../../atoms/TextField';
import { FieldRow } from './FieldRow';

const meta = {
  title: 'Layout/FieldRow',
  component: FieldRow,
} satisfies Meta<typeof FieldRow>;
export default meta;
type Story = StoryObj<typeof meta>;

/** One field has a hint, one an error, one neither: labels and inputs still line up. */
export const MixedHintsAndErrors: Story = {
  render: () => (
    <FieldRow>
      <TextField label="Họ và tên" defaultValue="Phạm Văn Nam" />
      <TextField label="Mã bệnh nhân" hint="In ở góc trên phiếu khám" />
      <TextField label="Năm sinh" defaultValue="58" error="Nhập năm sinh gồm 4 chữ số, ví dụ 1958" />
    </FieldRow>
  ),
};

/** Staff form, compact density: more columns on a wide screen. */
export const StaffCompact: Story = {
  parameters: { density: 'compact' },
  render: () => (
    <FieldRow minColumn="11rem">
      <TextField label="Chiều cao (cm)" placeholder="Chưa điền · ví dụ 162" />
      <TextField label="Cân nặng (kg)" placeholder="Chưa điền · ví dụ 58" />
      <TextField label="Mạch (lần/phút)" hint="Đo khi nghỉ" placeholder="Chưa điền · ví dụ 78" />
      <TextField label="Huyết áp (mmHg)" defaultValue="150/95" />
    </FieldRow>
  ),
};
