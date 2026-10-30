// The hoso staff shell shared by the staff page stories: compact header with system status and the signed-in person.
import clinicLogo from '../assets/fdc-logo.png';
import { StatusTag } from '../components/atoms/StatusTag';
import { TextLink } from '../components/atoms/TextLink';
import type { StaffLayoutProps } from '../components/templates/StaffLayout';

export const staffHeader: StaffLayoutProps['header'] = {
  logo: { src: clinicLogo, alt: 'FDC Bác sĩ gia đình, về Việc của tôi', href: '#' },
  appName: 'hoso',
  items: [{ label: 'Việc của tôi', href: '#', current: true }],
  tools: (
    <>
      {/* Auto-send runs for another batch only; Rạng Đông is sent by hand. Running is not finished, so the tag is
          info, never the success green. In the phone menu at 320px it may wrap instead of running off the screen. */}
      <StatusTag tone="info" size="sm" style={{ whiteSpace: 'normal' }}>
        Gửi tự động đang chạy: chỉ đợt F.D.I KSK 2026
      </StatusTag>
      <span>Chị Lan</span>
      <TextLink href="#" arrow={false}>
        Đăng xuất
      </TextLink>
    </>
  ),
};
