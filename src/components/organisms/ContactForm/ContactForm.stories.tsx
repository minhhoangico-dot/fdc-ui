import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormNoticeValue } from '../../molecules/FormNotice';
import { ContactForm } from './ContactForm';

const meta = {
  title: 'Organisms/ContactForm',
  component: ContactForm,
  args: { intro: 'Khi bạn có nhu cầu hãy liên hệ ngay với chúng tôi.' },
  decorators: [(Story) => <div style={{ maxWidth: 480, background: 'var(--brand-200)', padding: 'var(--space-15)' }}><Story /></div>],
  render: (args) => {
    const [notice, setNotice] = useState<FormNoticeValue | null>(null);
    return <ContactForm {...args} notice={notice} onSubmit={() => setNotice({ type: 'success', text: 'Đã gửi. Chúng tôi sẽ gọi lại cho bạn sớm.' })} />;
  },
} satisfies Meta<typeof ContactForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sending: Story = { args: { submitting: true } };
