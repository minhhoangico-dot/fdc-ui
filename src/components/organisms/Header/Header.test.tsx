import { render, screen } from '@testing-library/react';
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
