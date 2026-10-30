import type { Meta, StoryObj } from '@storybook/react';
import { FieldRow } from '../../layout/FieldRow';
import { NumberField } from '../../molecules/NumberField';
import { ErrorSummary } from './ErrorSummary';

const meta = {
  title: 'Organisms/ErrorSummary',
  component: ErrorSummary,
  tags: ['beta'],
  args: {
    focusOnMount: false,
    errors: [
      { fieldId: 'name', text: 'Nhập họ và tên' },
      { fieldId: 'phone', text: 'Nhập số điện thoại gồm 10 chữ số, ví dụ 0912 345 678' },
    ],
  },
} satisfies Meta<typeof ErrorSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Patient forms: one problem per line, each a 44px link. */
export const Default: Story = {};

/**
 * Staff form after "Xem lại" with four fields still empty: a smaller heading that gives the count, and the fields'
 * short names side by side as links, set apart by space (no dots), so the form stays in view. Still a list of four for
 * screen readers; each link is a 44px target and moves focus to its field, which says what to do ("Điền mạch").
 */
export const Inline: Story = {
  parameters: { density: 'compact' },
  args: {
    layout: 'inline',
    title: 'Còn 4 mục chưa điền',
    errors: [
      { fieldId: 'chieu-cao', text: 'Chiều cao' },
      { fieldId: 'can-nang', text: 'Cân nặng' },
      { fieldId: 'mach', text: 'Mạch' },
      { fieldId: 'huyet-ap-tam-thu', text: 'Huyết áp tâm thu' },
    ],
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)', maxWidth: 900 }}>
      <ErrorSummary {...args} />
      <FieldRow minColumn="12rem">
        <NumberField id="chieu-cao" label="Chiều cao" unit="cm" example="158" min={50} max={250} required error="Điền chiều cao" />
        <NumberField id="can-nang" label="Cân nặng" unit="kg" decimals={1} example="52,5" min={2} max={300} required error="Điền cân nặng" />
        <NumberField id="mach" label="Mạch" unit="lần/phút" example="78" min={30} max={250} required error="Điền mạch" />
        <NumberField id="huyet-ap-tam-thu" label="Huyết áp tâm thu" unit="mmHg" example="120" min={50} max={300} required error="Điền huyết áp tâm thu" />
      </FieldRow>
    </div>
  ),
};
