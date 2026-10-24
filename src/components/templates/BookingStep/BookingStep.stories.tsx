import type { Meta, StoryObj } from '@storybook/react';
import { BookingStep } from './BookingStep';

const Placeholder = ({ label }: { label: string }) => (
  <div style={{ border: '1px dashed var(--border-control)', padding: 'var(--space-20)', color: 'var(--text-muted)' }}>{label}</div>
);

const meta = {
  title: 'Templates/BookingStep',
  component: BookingStep,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Câu hỏi của bước này (tối đa khoảng 60 ký tự)',
    progress: 'Bước 2 trên 4',
    hint: 'Một dòng hướng dẫn ngắn nếu cần.',
    backHref: '#',
    children: <Placeholder label="Vùng nhập liệu: một câu hỏi, 1–3 trường" />,
  },
} satisfies Meta<typeof BookingStep>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Structure: Story = {};
export const FirstStep: Story = { args: { backHref: undefined, progress: 'Bước 1 trên 4' } };
export const NursingHomeHotline: Story = { args: { hotline: { number: '096 583 7777', label: 'Cần giúp? Gọi viện dưỡng lão' } } };
