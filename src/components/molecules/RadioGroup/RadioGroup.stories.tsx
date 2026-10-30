import type { Meta, StoryObj } from '@storybook/react';
import { recordGroups, records } from '../../../fixtures/ksk';
import { formatViInteger } from '../../../utils/vi';
import { RadioGroup } from './RadioGroup';

// The record list's groups and counts, from the same fixture as the page (Cần điền hoặc sửa · 1.019 … Tất cả · 2.033).
const listGroups = recordGroups.map((g) => ({
  value: g.value,
  label: `${g.label} · ${formatViInteger(records.filter((r) => !g.statuses.length || g.statuses.includes(r.status)).length)}`,
}));

const meta = {
  title: 'Molecules/RadioGroup',
  component: RadioGroup,
  tags: ['beta'],
  args: {
    label: 'Bạn đặt lịch cho ai?',
    name: 'who',
    options: [
      { value: 'self', label: 'Cho tôi' },
      { value: 'relative', label: 'Cho người thân', description: 'Ví dụ: bố mẹ, ông bà. Bạn sẽ nhập thông tin của người đi khám.' },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'relative' } };
export const Error: Story = { args: { error: 'Chọn người đi khám' } };
export const AsPageQuestion: Story = { args: { legendAsHeading: true, hint: 'Chọn một.' } };
export const WithDisabled: Story = {
  args: {
    label: 'Dịch vụ',
    name: 'service',
    options: [
      { value: 'da-khoa', label: 'Khám đa khoa' },
      { value: 'tai-nha', label: 'Khám tại nhà', description: 'Bác sĩ đến nhà trong nội thành Hà Nội' },
      { value: 'bhyt', label: 'Khám BHYT', description: 'Tạm ngưng nhận lịch trực tuyến', disabled: true },
    ],
  },
};

const yesNo = [
  { value: 'khong', label: 'Không' },
  { value: 'co', label: 'Có' },
];

/** Staff form: one history question, Không / Có in one row. The question reads as a label, not a heading. */
export const YesNoRow: Story = {
  args: {
    label: '7. Phẫu thuật can thiệp tim - mạch (thay van, bắc cầu nối, tạo hình mạch, máy tạo nhịp, đặt stent mạch, ghép tim)',
    name: 'q7',
    layout: 'row',
    hint: 'Chưa điền',
    options: yesNo,
  },
};

/** Five short options in one row on a 360px phone: compact density keeps 44px targets. */
export const ClassesCompact: Story = {
  args: {
    label: 'Phân loại sức khỏe',
    name: 'loai',
    layout: 'row',
    density: 'compact',
    defaultValue: 'II',
    options: ['I', 'II', 'III', 'IV', 'V'].map((v) => ({ value: v, label: v })),
  },
  decorators: [(Story) => <div style={{ maxWidth: 330 }}><Story /></div>],
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

/** After "Kiểm tra": one message and one red bar for the group, not a red box per option. */
export const RowError: Story = {
  args: {
    label: '8. Tăng huyết áp (I10)',
    name: 'q8',
    layout: 'row',
    options: yesNo,
    error: 'Chọn Không hoặc Có',
  },
};

/**
 * List filter with counts: pills, not tiles, so a filter never looks like a form question (compare ClassesCompact).
 * Still native radios: Tab reaches the chosen pill, arrow keys move the choice, the focus ring is drawn on the pill.
 */
export const FilterPills: Story = {
  args: {
    label: 'Nhóm người',
    name: 'nhom',
    variant: 'pills',
    layout: 'wrap',
    density: 'compact',
    defaultValue: 'can-lam',
    options: listGroups,
  },
  parameters: { density: 'compact' },
};
