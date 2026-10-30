import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { FieldRow } from '../../layout/FieldRow';
import { NumberField } from './NumberField';

const meta = {
  title: 'Molecules/NumberField',
  component: NumberField,
  args: { label: 'Mạch', unit: 'lần/phút', example: '78', min: 30, max: 250 },
  parameters: { density: 'compact' },
  // One field: about a phone's width. Stories of several fields set parameters.maxWidth.
  decorators: [(Story, { parameters }) => <div style={{ maxWidth: (parameters.maxWidth as string | number | undefined) ?? 360 }}><Story /></div>],
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Empty is neutral: a grey hint with an example, no red. */
export const Empty: Story = {};

/**
 * Filled and left: no hint, but the line keeps its room. "ví dụ 78" comes back while the field is focused, so
 * nothing moves when the person goes back in, types, or leaves.
 */
export const Filled: Story = { args: { defaultValue: '78' } };

/** Still empty after "Xem lại": the page's error takes the hint's line, with the example in it: "Điền mạch, ví dụ 78". */
export const EmptyAfterReview: Story = { args: { required: true, error: 'Điền mạch' } };

/**
 * Typed 300 and left the field: the field's own check says the allowed range, in the same line as the hint, so the box
 * does not move. The range is checked before the decimals: "1,58" in centimetres gets the range, not "Nhập số nguyên".
 */
export const OutOfRange: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Mạch' });
    const top = input.getBoundingClientRect().top;
    await userEvent.type(input, '300');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByText('Nhập từ 30 đến 250')).toBeInTheDocument();
    await expect(input.getBoundingClientRect().top).toBe(top);
  },
};

/** Inside the allowed range but above normal: a word tag in the line above the box, with the normal range; not an error. */
export const AboveNormal: Story = {
  args: { label: 'Glucose máu', unit: 'mmol/L', decimals: 1, example: '5,4', min: 0, max: 50, normalRange: [3.9, 6.4], defaultValue: '7,2' },
};

const pulse = { label: 'Mạch', unit: 'lần/phút', example: '78', min: 30, max: 250, normalRange: [60, 100] as [number, number] };
const systolic = { label: 'Tâm thu', unit: 'mmHg', example: '120', min: 50, max: 300, normalRange: [90, 139] as [number, number] };
const diastolic = { label: 'Tâm trương', unit: 'mmHg', example: '80', min: 30, max: 200, normalRange: [60, 89] as [number, number] };

/**
 * Saved values above and below normal, three to a row as on the entry page (columns about 13rem). The tag and the range
 * sit in the message line, so every box keeps its column's full width, "112 lần/phút" shows whole, and the boxes of
 * the two rows share their right edges with the plain row above.
 */
export const SavedOutsideNormal: Story = {
  parameters: { maxWidth: '44rem' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
      <FieldRow minColumn="9rem">
        <NumberField label="Chiều cao" unit="cm" example="158" min={50} max={250} defaultValue="170" />
        <NumberField label="Cân nặng" unit="kg" decimals={1} example="52,5" min={2} max={300} defaultValue="65" />
        <NumberField label="Nhịp thở" unit="lần/phút" example="18" min={5} max={60} defaultValue="18" />
      </FieldRow>
      <FieldRow minColumn="9rem">
        <NumberField {...pulse} defaultValue="112" />
        <NumberField {...systolic} defaultValue="145" />
        <NumberField {...diastolic} defaultValue="95" />
      </FieldRow>
      <FieldRow minColumn="9rem">
        <NumberField {...pulse} label="Mạch lúc nghỉ" defaultValue="45" />
        <NumberField {...systolic} label="Tâm thu lúc nghỉ" defaultValue="85" />
        <NumberField {...diastolic} label="Tâm trương lúc nghỉ" defaultValue="45" />
      </FieldRow>
    </div>
  ),
};

/**
 * The blood pressure pair in two narrow columns, as on a 320px phone (about 7.5rem each): "145" and "45" show whole
 * beside "mmHg"; there is no room for the range, so the line shows the tag alone.
 */
export const SavedOutsideNormalNarrow: Story = {
  parameters: { maxWidth: '16rem' },
  render: () => (
    <div role="group" aria-label="Huyết áp" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 'var(--space-20)' }}>
      <NumberField {...systolic} defaultValue="145" />
      <NumberField {...diastolic} defaultValue="45" />
    </div>
  ),
};

/**
 * Type a pulse of 112 and leave: the "Cao" tag appears in the line above the box, and neither the box nor the
 * button below it moves between pressing and releasing the mouse, so the click lands.
 */
export const TypeAndLeave: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
      <NumberField {...args} {...pulse} />
      <button type="button" style={{ minBlockSize: 'var(--target-min)', inlineSize: 'fit-content' }}>
        Ô tiếp theo
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Mạch' });
    const next = canvas.getByRole('button', { name: 'Ô tiếp theo' });
    const before = [input.getBoundingClientRect().top, next.getBoundingClientRect().top];
    await userEvent.type(input, '112');
    await expect(input.getBoundingClientRect().top).toBe(before[0]);
    await userEvent.click(next);
    await expect(canvas.getByText('Cao')).toBeInTheDocument();
    await expect([input.getBoundingClientRect().top, next.getBoundingClientRect().top]).toEqual(before);
  },
};

/** Measurements side by side in a FieldRow: labels, message lines and boxes line up, whichever field has a hint or a tag. */
export const Vitals: Story = {
  parameters: { maxWidth: 900 },
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
