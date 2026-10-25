// Real menus and footer details from bacsigiadinhhanoi.vn and fdcmedical.vn (fetched 24/10/2026).
import type { FooterProps } from '../components/organisms/Footer';
import type { HeaderProps } from '../components/organisms/Header';
import clinicLogo from '../assets/fdc-logo.png';

export const clinicHeader: HeaderProps = {
  logo: { src: clinicLogo, alt: 'FDC Bác sĩ gia đình, về trang chủ', href: '#' },
  hours: 'Mở cửa 07:00–20:00, tất cả các ngày',
  hotline: { number: '024 35 430 430', label: 'Tổng đài' },
  cta: { label: 'Đặt lịch khám', href: '#dat-lich' },
  items: [
    { label: 'Trang chủ', href: '#trang-chu' },
    { label: 'Giới thiệu', href: '#gioi-thieu' },
    { label: 'Đội ngũ chuyên môn', href: '#doi-ngu' },
    { label: 'Bảng giá', href: '#bang-gia' },
    { label: 'Tin tức hoạt động', href: '#tin-tuc' },
    { label: 'Thư viện ảnh', href: '#thu-vien' },
    { label: 'Liên hệ', href: '#lien-he' },
  ],
};

export const clinicFooter: FooterProps = {
  name: 'Công ty cổ phần Trung tâm bác sĩ gia đình Hà Nội',
  tagline: 'Hanoi Family Doctor Center',
  address: '75 đường Hồ Mễ Trì, Phường Đại Mỗ, Hà Nội',
  phones: [{ number: '024 35 430 430' }],
  email: 'minhhb@bacsigiadinhhanoi.vn',
  legal: ['SĐKKD: 0105378374 do Sở KH&ĐT TP Hà Nội cấp ngày 24/6/2011', 'Đại diện: Hoàng Thị Mai Phương'],
  columns: [
    {
      title: 'Về FDC',
      links: [
        { label: 'Giới thiệu', href: '#gioi-thieu' },
        { label: 'Đội ngũ chuyên môn', href: '#doi-ngu' },
        { label: 'Tin tức hoạt động', href: '#tin-tuc' },
      ],
    },
    {
      title: 'Dịch vụ',
      links: [
        { label: 'Đặt lịch khám', href: '#dat-lich' },
        { label: 'Bảng giá', href: '#bang-gia' },
        { label: 'Liên hệ', href: '#lien-he' },
      ],
    },
  ],
  copyright: '© 2026 Công ty cổ phần Trung tâm bác sĩ gia đình Hà Nội.',
};

export const nursingHomeHeader: HeaderProps = {
  logo: { src: clinicLogo, alt: 'Điều dưỡng FDC, về trang chủ', href: '#' },
  hotline: { number: '096 583 7777', label: 'Hotline 24/7' },
  cta: { label: 'Đăng ký tham quan', href: '#dang-ky' },
  items: [
    { label: 'Trang chủ', href: '#trang-chu' },
    {
      label: 'Giới thiệu',
      href: '#gioi-thieu',
      children: [
        { label: 'Câu chuyện thương hiệu', href: '#cau-chuyen' },
        { label: 'Cơ sở vật chất', href: '#co-so' },
        { label: 'Đội ngũ nhân sự chủ chốt', href: '#doi-ngu' },
        { label: 'Lịch sinh hoạt – Thực đơn', href: '#lich-sinh-hoat' },
      ],
    },
    {
      label: 'Dưỡng lão',
      href: '#duong-lao',
      children: [
        { label: 'Chăm sóc nội trú', href: '#noi-tru' },
        { label: 'Chăm sóc ngoại trú', href: '#ngoai-tru' },
        { label: 'Chăm sóc tại gia', href: '#tai-gia' },
      ],
    },
    {
      label: 'Phục hồi chức năng',
      href: '#phcn',
      children: [
        { label: 'Điều trị nghỉ dưỡng sau xuất viện', href: '#sau-xuat-vien' },
        { label: 'Phục hồi chức năng ngoại trú', href: '#phcn-ngoai-tru' },
        { label: 'Phục hồi chức năng tại gia', href: '#phcn-tai-gia' },
      ],
    },
    {
      label: 'Y học cổ truyền',
      href: '#yhct',
      children: [
        { label: 'Y học cổ truyền sau xuất viện', href: '#yhct-sau-xuat-vien' },
        { label: 'Y học cổ truyền ngoại trú', href: '#yhct-ngoai-tru' },
        { label: 'Y học cổ truyền tại gia', href: '#yhct-tai-gia' },
      ],
    },
    { label: 'Bảng giá', href: '#bang-gia' },
    { label: 'Thủ tục đăng ký', href: '#thu-tuc' },
  ],
};

export const nursingHomeFooter: FooterProps = {
  name: 'Điều dưỡng FDC',
  tagline: 'Khơi nguồn sức khỏe, san sẻ âu lo',
  address: 'Thôn Long Phú, Phú Cát, Hà Nội',
  phones: [{ number: '096 583 7777', label: 'Hotline 24/7' }, { number: '024 35 430 430' }],
  email: 'fdc@bacsigiadinhhanoi.vn',
  legal: [
    'Văn phòng: Bác sĩ gia đình FDC, số 75 đường Hồ Mễ Trì, P. Đại Mỗ, Hà Nội',
    'SĐKKD: 0105378374 do Sở KH&ĐT TP Hà Nội cấp ngày 24/6/2011 · Đại diện: Hoàng Thị Mai Phương',
  ],
  columns: [
    {
      title: 'Dịch vụ',
      links: [
        { label: 'Dưỡng lão', href: '#duong-lao' },
        { label: 'Phục hồi chức năng', href: '#phcn' },
        { label: 'Y học cổ truyền', href: '#yhct' },
      ],
    },
    {
      title: 'Thông tin',
      links: [
        { label: 'Bảng giá', href: '#bang-gia' },
        { label: 'Thủ tục đăng ký', href: '#thu-tuc' },
      ],
    },
  ],
  copyright: '© 2026 fdcmedical.vn',
};
