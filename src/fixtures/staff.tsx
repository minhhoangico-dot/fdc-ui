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
      <StatusTag tone="success">Gửi tự động đang chạy</StatusTag>
      <span>Chị Lan</span>
      <a href="#" style={{ display: 'inline-flex', alignItems: 'center', minBlockSize: 'var(--target-min)', color: 'var(--text-link)', fontWeight: 600 }}>
        Đăng xuất
      </a>
    </>
  ),
};
