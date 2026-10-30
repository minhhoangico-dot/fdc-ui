import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../../atoms/Select';
import { TextField } from '../../atoms/TextField';
import { Combobox } from '../../molecules/Combobox';
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

const occupations = [
  { value: '22', label: 'Nhà chuyên môn về sức khỏe', code: '22', hint: 'Thuộc nhóm 2' },
  { value: '4', label: 'Nhân viên trợ lý văn phòng', code: '4' },
  { value: '83', label: 'Lái xe và thợ vận hành thiết bị chuyển động', code: '83', hint: 'Thuộc nhóm 8' },
];

/**
 * Different field components in one row: a Combobox (its own hint), a TextField whose hint is longer
 * and wraps, and a Select with no hint. Labels share a line and the boxes share a line.
 */
export const MixedFieldTypes: Story = {
  parameters: { density: 'compact' },
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <FieldRow minColumn="14rem">
        <Combobox label="Nghề nghiệp" options={occupations} defaultValue="4" />
        <TextField
          label="Nơi làm việc"
          hint="Ghi đủ tên công ty hoặc cơ quan như trên hợp đồng khám sức khỏe của đợt, kể cả chi nhánh"
          defaultValue="Công ty TNHH Rạng Đông"
        />
        <Select
          label="Phân loại sức khỏe"
          defaultValue="II"
          options={[
            { value: 'I', label: 'Loại I' },
            { value: 'II', label: 'Loại II' },
            { value: 'III', label: 'Loại III' },
            { value: 'IV', label: 'Loại IV' },
            { value: 'V', label: 'Loại V' },
          ]}
        />
      </FieldRow>
    </div>
  ),
};

/** The same mix with an error on one field and none on the others. */
export const MixedFieldTypesWithError: Story = {
  parameters: { density: 'compact' },
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <FieldRow minColumn="14rem">
        <Combobox label="Nghề nghiệp" options={occupations} required error="Chọn nghề nghiệp trước khi xem lại" />
        <TextField label="Nơi làm việc" defaultValue="Công ty TNHH Rạng Đông" />
        <Select label="Nhóm máu" hint="Không bắt buộc" defaultValue="">
          <option value="">Chưa biết</option>
          <option value="O">O</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="AB">AB</option>
        </Select>
      </FieldRow>
    </div>
  ),
};
