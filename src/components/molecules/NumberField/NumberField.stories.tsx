import type { Meta, StoryObj } from '@storybook/react';
import { FieldRow } from '../../layout/FieldRow';
import { NumberField } from './NumberField';

const meta = {
  title: 'Molecules/NumberField',
  component: NumberField,
  args: { label: 'Mạch', unit: 'lần/phút', example: '78', min: 30, max: 250 },
  parameters: { density: 'compact' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Empty is neutral: a grey hint with an example, no red. */
export const Empty: Story = {};

/** Filled and left: no hint. "ví dụ 78" comes back while the field is focused, so typing never moves the box. */
export const Filled: Story = { args: { defaultValue: '78' } };

/** Still empty after "Xem lại": the red line already says it is empty, so the grey hint keeps only "ví dụ 78". */
export const EmptyAfterReview: Story = { args: { required: true, error: 'Điền mạch' } };

/** Typed 300 and left the field: the message says the allowed range. */
export const OutOfRange: Story = { args: { defaultValue: '300', error: 'Mạch từ 30 đến 250 lần/phút.' } };

/** Inside the allowed range but above normal: a word tag, not an error. */
export const AboveNormal: Story = {
  args: { label: 'Glucose máu', unit: 'mmol/L', decimals: 1, example: '5,4', min: 0, max: 50, normalRange: [3.9, 6.4], defaultValue: '7,2' },
};

/** Measurements side by side in a FieldRow: labels, hints and boxes line up, whether a field has a hint or not. */
export const Vitals: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 900 }}><Story /></div>],
  render: () => (
    <FieldRow minColumn="12rem">
      <NumberField label="Chiều cao" unit="cm" example="158" min={50} max={250} defaultValue="158" />
      <NumberField label="Cân nặng" unit="kg" decimals={1} example="52,5" min={2} max={300} defaultValue="52,5" />
      <NumberField label="Mạch" unit="lần/phút" example="78" min={30} max={250} />
      <NumberField label="Huyết áp tâm thu" unit="mmHg" example="120" min={50} max={300} normalRange={[90, 139]} defaultValue="145" />
      <NumberField label="Huyết áp tâm trương" unit="mmHg" example="80" min={30} max={200} normalRange={[60, 89]} defaultValue="90" />
    </FieldRow>
  ),
};
