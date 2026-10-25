import type { Meta, StoryObj } from '@storybook/react';
import { CareCard } from '../components/molecules/CareCard';
import { Stack } from '../components/layout/Stack';
import { SiteLayout } from '../components/templates/SiteLayout';
import { clinicFooter, clinicHeader, nursingHomeFooter, nursingHomeHeader } from '../fixtures/site';

function CareAdvice() {
  return (
    <div style={{ maxWidth: 'var(--measure)', margin: '0 auto', padding: 'var(--space-30) var(--space-15)' }}>
      <Stack gap={30}>
        <div>
          <h1 style={{ margin: 0 }}>Sốt ở người cao tuổi: khi nào cần đi khám</h1>
          <p>Người cao tuổi có thể sốt nhẹ hơn người trẻ dù bệnh nặng. Hãy để ý cả những thay đổi khác như ăn ít, mệt hoặc lú lẫn.</p>
        </div>
        <CareCard level="non-urgent" title="Gọi bác sĩ gia đình nếu:">
          <ul>
            <li>sốt trên 3 ngày</li>
            <li>ho kéo dài hơn 3 tuần</li>
            <li>bạn lo lắng về sức khỏe của bố mẹ</li>
          </ul>
          <p>Gọi 024 35 430 430, hoặc đặt lịch khám tại nhà.</p>
        </CareCard>
        <CareCard level="urgent" title="Đến khám trong ngày hoặc gọi 024 35 430 430 nếu:">
          <ul>
            <li>sốt cao trên 39 độ, uống thuốc hạ sốt không đỡ</li>
            <li>lú lẫn hơn bình thường, ăn uống kém hẳn</li>
            <li>tiểu ít hoặc không tiểu trong 12 giờ</li>
          </ul>
        </CareCard>
        <CareCard level="emergency" title="Gọi cấp cứu 115 ngay nếu:">
          <ul>
            <li>đau ngực, khó thở</li>
            <li>méo miệng, yếu hoặc tê nửa người, nói khó</li>
            <li>ngất, co giật, hoặc không đánh thức được</li>
          </ul>
        </CareCard>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Nội dung mẫu để minh họa thiết kế; bác sĩ của FDC cần duyệt trước khi đăng. Trang được xem lại lần cuối: 24/10/2026.</p>
      </Stack>
    </div>
  );
}

const meta = {
  title: 'Pages/Khi nào cần đi khám',
  component: CareAdvice,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CareAdvice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Clinic: Story = {
  render: () => (
    <SiteLayout header={clinicHeader} footer={clinicFooter}>
      <CareAdvice />
    </SiteLayout>
  ),
};
export const NursingHome: Story = {
  render: () => (
    <SiteLayout theme="nursing-home" header={nursingHomeHeader} footer={nursingHomeFooter}>
      <CareAdvice />
    </SiteLayout>
  ),
};
