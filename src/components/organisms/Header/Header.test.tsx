import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { nursingHomeHeader } from '../../../fixtures/site';
import { Header } from './Header';

describe('Header', () => {
  it('has a named nav, the hotline, and a mobile menu button that toggles', async () => {
    render(<Header {...nursingHomeHeader} />);
    expect(screen.getByRole('navigation', { name: 'Menu chính' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /096 583 7777/ })).toHaveAttribute('href', 'tel:0965837777');
    const menu = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toHaveAccessibleName('Đóng menu');
  });

  it('opens sub-menus by click and closes them with Escape, returning focus', async () => {
    render(<Header {...nursingHomeHeader} />);
    const trigger = screen.getByRole('button', { name: 'Dưỡng lão' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Chăm sóc nội trú' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('marks the current page', () => {
    render(<Header {...nursingHomeHeader} items={[{ label: 'Bảng giá', href: '#bang-gia', current: true }]} />);
    expect(screen.getByRole('link', { name: 'Bảng giá' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('Header compact', () => {
  const props = {
    variant: 'compact' as const,
    logo: { src: 'logo.png', alt: 'FDC Bác sĩ gia đình, về Việc của tôi', href: '/' },
    appName: 'hoso',
    items: [{ label: 'Việc của tôi', href: '/', current: true }],
    tools: (
      <>
        <span>Chị Lan</span>
        <a href="/dang-xuat">Đăng xuất</a>
      </>
    ),
  };

  it('is one row with the app name, the named menu and the tools; no hotline or CTA', async () => {
    render(<Header {...props} hotline={{ number: '024 35 430 430' }} cta={{ label: 'Đặt lịch khám', href: '/' }} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-variant', 'compact');
    expect(screen.getByRole('link', { name: 'FDC Bác sĩ gia đình, về Việc của tôi hoso' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('navigation', { name: 'Menu chính' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Việc của tôi' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Đăng xuất' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /024 35 430 430/ })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Đặt lịch khám' })).toBeNull();
    // The menu button controls the panel holding the menu and the tools; Esc closes it and returns focus.
    const menu = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(menu.getAttribute('aria-controls')!)).toContainElement(screen.getByRole('link', { name: 'Đăng xuất' }));
    await userEvent.keyboard('{Escape}');
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveFocus();
  });

  it('collapseOnScroll: sticks, and marks itself collapsed after scrolling down', () => {
    render(
      <Header
        {...props}
        collapseOnScroll
        compactBar={
          <>
            <strong>Đặng Thanh Chi</strong>
            <span>Sinh 07/07/1990</span>
            <span>RD26-0006</span>
          </>
        }
      />,
    );
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-sticky', 'true');
    expect(header).not.toHaveAttribute('data-collapsed');
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(header).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByText('RD26-0006')).toBeInTheDocument();
    // The menu button keeps its name in the thin bar, even when only its icon shows.
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(header).not.toHaveAttribute('data-collapsed');
  });

  it('the site variant is unchanged by default', () => {
    render(<Header {...props} variant={undefined} />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-variant', 'site');
    expect(screen.queryByText('hoso')).toBeNull();
  });
});

