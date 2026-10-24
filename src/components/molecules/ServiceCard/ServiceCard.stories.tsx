import type { Meta, StoryObj } from '@storybook/react';
import { ServiceCard } from './ServiceCard';

const meta = {
  title: 'Molecules/ServiceCard',
  component: ServiceCard,
  args: {
    icon: 'home',
    title: 'Khám chữa bệnh tại nhà',
    excerpt: 'Đơn vị đi đầu cả nước trong lĩnh vực bác sĩ gia đình, làm mô hình mẫu cho nhiều đoàn công tác của Bộ Y tế.',
    href: '#',
  },
  decorators: [(Story) => <div style={{ maxWidth: 320, background: 'var(--brand-200)', padding: 'var(--space-15)' }}><Story /></div>],
} satisfies Meta<typeof ServiceCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoLink: Story = { args: { href: undefined } };
export const LongExcerpt: Story = {
  args: { excerpt: 'Các bác sĩ giàu kinh nghiệm từ bệnh viện đại học Y, bệnh viện Nhi Trung Ương, bệnh viện phụ sản Hà Nội và các bệnh viện tuyến đầu khác, khám và theo dõi sức khỏe cho cả gia đình, từ trẻ nhỏ đến người cao tuổi.' },
};
