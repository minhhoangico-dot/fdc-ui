import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

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
