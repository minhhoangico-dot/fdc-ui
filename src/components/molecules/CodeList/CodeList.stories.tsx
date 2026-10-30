import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { icd10 } from '../../../fixtures/ksk';
import { CodeList } from './CodeList';

const meta = {
  title: 'Molecules/CodeList',
  component: CodeList,
  args: { label: 'Bệnh, tật', hint: 'Chọn mọi bệnh, tật phát hiện khi khám.', options: icd10 },
  parameters: { density: 'compact' },
  decorators: [(Story) => <div style={{ maxWidth: 560, minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof CodeList>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing chosen yet: a neutral line, not an error. */
export const Empty: Story = {};

/** One person, two diseases: each reads name first, code after and lighter, with "Bỏ". */
export const TwoDiagnoses: Story = { args: { defaultValue: ['I10', 'E11'] } };

/**
 * One message and one red bar for the whole group. The add field is marked invalid and reads the same message,
 * so a link from the ErrorSummary (to `id`) lands on a field that says what is wrong.
 */
export const Error: Story = { args: { error: 'Thêm ít nhất một bệnh, tật trước khi xem lại', id: 'benh-tat' } };

/** Typing the code of an item already in the list says so, with its name and code, instead of "Không tìm thấy". */
export const AlreadyInTheList: Story = {
  args: { defaultValue: ['I10'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('combobox'), 'i10');
    await expect(await canvas.findByText('Tăng huyết áp vô căn (nguyên phát) (I10) đã có trong danh sách.', { selector: 'div' })).toBeVisible();
  },
};
