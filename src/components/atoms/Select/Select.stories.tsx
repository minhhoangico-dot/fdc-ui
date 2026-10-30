import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { recordGroups, records } from '../../../fixtures/ksk';
import { formatViInteger } from '../../../utils/vi';
import { Select } from './Select';

const healthClasses = [
  { value: 'I', label: 'Loại I · Rất khỏe' },
  { value: 'II', label: 'Loại II · Khỏe' },
  { value: 'III', label: 'Loại III · Trung bình' },
  { value: 'IV', label: 'Loại IV · Yếu' },
  { value: 'V', label: 'Loại V · Rất yếu' },
];

// The record list's six groups with their counts, from the same fixture as the page (2.033 people in the batch).
const groups = recordGroups.map((g) => ({
  value: g.value,
  label: g.label,
  count: records.filter((r) => !g.statuses.length || g.statuses.includes(r.status)).length,
}));

const meta = {
  title: 'Atoms/Select',
  component: Select,
  args: { label: 'Phân loại sức khỏe', options: healthClasses },
  parameters: { density: 'compact' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A native select: Tab to it, then choose with the keyboard or the list the phone opens. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox');
    await userEvent.tab();
    await expect(select).toHaveFocus();
    await userEvent.selectOptions(select, 'II');
    await expect(select).toHaveValue('II');
  },
};

export const WithHint: Story = { args: { hint: 'Theo kết luận của bác sĩ' } };

export const Required: Story = { args: { required: true, defaultValue: 'II' } };

/** Nothing chosen yet: a first option says so; the error names what to do. */
export const Error: Story = {
  args: { required: true, defaultValue: '', error: 'Chọn phân loại sức khỏe trước khi xem lại' },
  render: (args) => (
    <Select {...args} options={undefined}>
      <option value="" disabled>
        Chưa chọn
      </option>
      {healthClasses.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'II', hint: 'Bác sĩ kết luận đã ký, không sửa được' } };

/**
 * The record list's filter on a phone: six tiles would fill the screen, so the same choice
 * collapses to one Select with the count in each option ("Cần điền hoặc sửa · 1.019").
 */
export const ListFilter: Story = {
  render: function ListFilter() {
    const [group, setGroup] = useState('can-lam');
    const current = groups.find((g) => g.value === group)!;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
        <Select
          label="Nhóm người"
          name="nhom"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          options={groups.map((g) => ({ value: g.value, label: `${g.label} · ${formatViInteger(g.count)}` }))}
        />
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>
          Hiển thị 1–{Math.min(50, current.count)} trong {formatViInteger(current.count)}
        </p>
      </div>
    );
  },
};

/** At 320px a long option is cut with "…" in the box; the open list shows it in full. */
export const LongOptions: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 288 }}><Story /></div>],
  args: {
    label: 'Nơi khám',
    options: [
      { value: 'ho-me-tri', label: 'Phòng khám Bác sĩ Gia đình, 75 đường Hồ Mễ Trì, Phường Đại Mỗ, Hà Nội' },
      { value: 'long-phu', label: 'Điều dưỡng FDC, Thôn Long Phú, Phú Cát, Hà Nội' },
    ],
  },
};

/** Patients and families: comfortable density, 18px text, 48px box. */
export const Comfortable: Story = {
  parameters: { density: 'comfortable' },
  args: {
    label: 'Bạn muốn khám ở đâu?',
    options: [
      { value: 'ho-me-tri', label: 'Phòng khám Bác sĩ Gia đình (Hồ Mễ Trì)' },
      { value: 'long-phu', label: 'Điều dưỡng FDC (Long Phú)' },
    ],
  },
};
