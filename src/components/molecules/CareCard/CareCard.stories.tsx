import type { Meta, StoryObj } from '@storybook/react';
import { CareCard } from './CareCard';

const meta = {
  title: 'Molecules/CareCard',
  component: CareCard,
  tags: ['beta'],
  args: {
    level: 'non-urgent',
    title: 'Gọi bác sĩ gia đình nếu:',
    children: (
      <ul>
        <li>sốt trên 3 ngày</li>
        <li>ho kéo dài hơn 3 tuần</li>
        <li>bạn lo lắng về sức khỏe của người thân</li>
      </ul>
    ),
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof CareCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NonUrgent: Story = {};
export const Urgent: Story = {
  args: {
    level: 'urgent',
    title: 'Đến khám trong ngày hoặc gọi 024 35 430 430 nếu:',
    children: (
      <ul>
        <li>sốt cao trên 39 độ không hạ</li>
        <li>người cao tuổi lú lẫn hơn bình thường</li>
      </ul>
    ),
  },
};
export const Emergency: Story = {
  args: {
    level: 'emergency',
    title: 'Gọi cấp cứu 115 ngay nếu:',
    children: (
      <ul>
        <li>đau ngực, khó thở</li>
        <li>méo miệng, yếu hoặc tê nửa người, nói khó</li>
        <li>ngất, co giật</li>
      </ul>
    ),
  },
};
