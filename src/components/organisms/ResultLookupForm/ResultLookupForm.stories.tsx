import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { FormNoticeValue } from '../../molecules/FormNotice';
import { ResultLookupForm } from './ResultLookupForm';

const meta = {
  title: 'Organisms/ResultLookupForm',
  component: ResultLookupForm,
  decorators: [(Story) => <div style={{ background: 'var(--surface-alt)', padding: 'var(--space-15)' }}><Story /></div>],
  render: (args) => {
    const [notice, setNotice] = useState<FormNoticeValue | null>(null);
    return <ResultLookupForm {...args} notice={notice} onSubmit={() => setNotice({ type: 'success', text: 'Đã tìm thấy kết quả ngày khám.' })} />;
  },
} satisfies Meta<typeof ResultLookupForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SubmitEmptyShowsSummary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Xem kết quả' }));
    const summary = await canvas.findByRole('alert');
    await expect(summary).toHaveFocus();
    await expect(within(summary).getAllByRole('link')).toHaveLength(4);
  },
};
