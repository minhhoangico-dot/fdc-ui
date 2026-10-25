import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { clinicHeader, nursingHomeHeader } from '../../../fixtures/site';
import { StatusTag } from '../../atoms/StatusTag';
import { Header } from './Header';

const meta = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['beta'],
  parameters: { layout: 'fullscreen' },
  args: { ...clinicHeader, items: clinicHeader.items.map((i, n) => (n === 0 ? { ...i, current: true } : i)) },
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Clinic: Story = {};
export const ClinicPhone: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const NursingHome: Story = { args: { ...nursingHomeHeader, hours: undefined } };
export const SubmenuOpensOnClick: Story = {
  args: { ...nursingHomeHeader, hours: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Dưỡng lão/ });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: 'Chăm sóc nội trú' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
};

/* ---------- Staff tools: compact ---------- */

const staffTools = (
  <>
    <StatusTag tone="success">Gửi tự động đang chạy</StatusTag>
    <span>Chị Lan</span>
    <a href="#" style={{ display: 'inline-flex', alignItems: 'center', minBlockSize: 'var(--target-min)', color: 'var(--text-link)', fontWeight: 600 }}>
      Đăng xuất
    </a>
  </>
);
const staffHeader = {
  variant: 'compact' as const,
  logo: { ...clinicHeader.logo, alt: 'FDC Bác sĩ gia đình, về Việc của tôi' },
  appName: 'hoso',
  items: [
    { label: 'Việc của tôi', href: '#', current: true },
    { label: 'Đợt khám', href: '#' },
  ],
  tools: staffTools,
};

/** Staff tools: one row ≤ 60px with logo, app name, menu and the tools slot. */
export const StaffCompact: Story = { args: staffHeader };

/** On phones the menu and tools sit behind the Menu button. */
export const StaffCompactPhone: Story = {
  args: staffHeader,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // On a wide screen the menu is already in the row and the button is hidden.
    const menu = canvas.queryByRole('button', { name: 'Menu' });
    if (!menu) return;
    await userEvent.click(menu);
    await expect(canvas.getByRole('link', { name: 'Đăng xuất' })).toBeVisible();
  },
};

const workingOn = (
  <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
    <strong style={{ fontFamily: 'var(--font-heading)' }}>Đặng Thanh Chi</strong>
    <span style={{ color: 'var(--text-muted)' }}>07/07/1990 · TESTA-0006</span>
  </span>
);

/** Scrolled down on a phone: the logo row shrinks to a thin sticky bar that keeps who is being worked on. */
export const StaffCollapsesOnScroll: Story = {
  args: { ...staffHeader, collapseOnScroll: true, compactBar: workingOn },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <>
      <Header {...args} />
      <main style={{ padding: 'var(--space-20) var(--space-15)', minBlockSize: '200vh' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>Đặng Thanh Chi</h1>
        <p>07/07/1990 · TESTA-0006 · Khám sức khỏe định kỳ</p>
      </main>
    </>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('header')!;
    await expect(header).not.toHaveAttribute('data-collapsed');
    window.scrollTo({ top: 400, behavior: 'instant' });
    window.dispatchEvent(new Event('scroll'));
    await new Promise((r) => setTimeout(r, 50));
    await expect(header).toHaveAttribute('data-collapsed', 'true');
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.dispatchEvent(new Event('scroll'));
    await new Promise((r) => setTimeout(r, 50));
    await expect(header).not.toHaveAttribute('data-collapsed');
  },
};
