import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { icd10, occupations } from '../../../fixtures/ksk';
import { FieldRow } from '../../layout/FieldRow';
import { TextField } from '../../atoms/TextField';
import { Combobox } from './Combobox';

const meta = {
  title: 'Molecules/Combobox',
  component: Combobox,
  args: { label: 'Chẩn đoán', options: icd10 },
  parameters: { density: 'compact' },
  decorators: [(Story) => <div style={{ maxWidth: 560, minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

/**
 * A choice reads name first, code after and lighter: "Tăng huyết áp vô căn (nguyên phát) (I10)". When the box is
 * too narrow the name is cut ("Tăng huyết … (I10)"), never the code. Focused, the field shows its own text, scrolled so the code is in view.
 */
export const Chosen: Story = { args: { defaultValue: 'I10' } };

/** Typed without tone marks; the list shows matches by name, code or other words. */
export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox');
    await userEvent.type(input, 'tang');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
  },
};

export const NoResults: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('combobox'), 'ung thu');
  },
};

export const Error: Story = { args: { label: 'Nghề nghiệp', options: occupations, required: true, error: 'Chọn nghề nghiệp trước khi xem lại' } };

/**
 * Lines up with TextFields in a FieldRow. In a two-column row the chosen name is cut and its code kept:
 * "Nhà chuy… (22)". "Xóa" stays outside the box, a 44px target.
 */
export const InAFieldRow: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 900 }}><Story /></div>],
  render: () => (
    <FieldRow minColumn="16rem">
      <TextField label="Nơi làm việc" defaultValue="Công ty TNHH Rạng Đông" />
      <Combobox label="Nghề nghiệp" options={occupations} defaultValue="22" />
    </FieldRow>
  ),
};
