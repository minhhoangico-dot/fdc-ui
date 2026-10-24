import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput';

const meta = {
  title: 'Molecules/DateInput',
  component: DateInput,
  tags: ['beta'],
  args: { label: 'Ngày sinh của người bệnh', required: true },
} satisfies Meta<typeof DateInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: { day: '27', month: '3', year: '1950' } } };
export const Error: Story = { args: { defaultValue: { day: '31', month: '2', year: '1950' }, error: 'Ngày sinh không có thật, vui lòng kiểm tra lại' } };
export const VisitDate: Story = { args: { label: 'Ngày khám', birthday: false, hint: 'Ngày ghi trên phiếu khám, ví dụ: 24 10 2026' } };
