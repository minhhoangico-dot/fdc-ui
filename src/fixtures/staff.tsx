// The hoso staff shell shared by the staff page stories: compact header with system status and the signed-in person.
import clinicLogo from '../assets/fdc-logo.png';
import { StatusTag } from '../components/atoms/StatusTag';
import type { StaffLayoutProps } from '../components/templates/StaffLayout';

export const staffHeader: StaffLayoutProps['header'] = {
  logo: { src: clinicLogo, alt: 'FDC Bác sĩ gia đình, về Việc của tôi', href: '#' },
  appName: 'hoso',
  items: [{ label: 'Việc của tôi', href: '#', current: true }],
  tools: (
    <>
      {/* Says which batch auto-send runs for, so nobody reads it as "this batch is being sent".
          In the phone menu at 320px it may wrap instead of running off the screen. */}
      <StatusTag tone="success" size="sm" style={{ whiteSpace: 'normal' }}>
        Gửi tự động: đang chạy cho F.D.I KSK 2026
      </StatusTag>
      <span>Chị Lan</span>
      <a href="#" style={{ display: 'inline-flex', alignItems: 'center', minBlockSize: 'var(--target-min)', color: 'var(--text-link)', fontWeight: 600 }}>
        Đăng xuất
      </a>
    </>
  ),
};
