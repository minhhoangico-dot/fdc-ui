import type { Meta, StoryObj } from '@storybook/react';
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

export const Default: Story = {};
