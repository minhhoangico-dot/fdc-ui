import type { Meta, StoryObj } from '@storybook/react';
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

/** One message and one red bar for the whole group. */
export const Error: Story = { args: { error: 'Thêm ít nhất một bệnh, tật trước khi xem lại' } };
