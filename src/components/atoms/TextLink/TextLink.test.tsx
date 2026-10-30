import { render, screen } from '@testing-library/react';
import { TextLink } from './TextLink';

describe('TextLink', () => {
  it('defaults to "Xem chi tiết" with the double chevron after the words, hidden from screen readers', () => {
    render(<TextLink href="/bang-gia" />);
    const link = screen.getByRole('link', { name: 'Xem chi tiết' });
    expect(link).toHaveAttribute('href', '/bang-gia');
    expect(link.lastElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('back puts one chevron before the words, next one after, false none; the name is only the words', () => {
    render(
      <>
        <TextLink href="#tien-su" arrow="back">
          3. Tiền sử
        </TextLink>
        <TextLink href="#lam-sang" arrow="next">
          5. Lâm sàng
        </TextLink>
        <TextLink href="#dang-xuat" arrow={false}>
          Đăng xuất
        </TextLink>
      </>,
    );
    const back = screen.getByRole('link', { name: '3. Tiền sử' });
    expect(back.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(back.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    const next = screen.getByRole('link', { name: '5. Lâm sàng' });
    expect(next.lastElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(screen.getByRole('link', { name: 'Đăng xuất' }).querySelector('svg')).toBeNull();
  });
});
