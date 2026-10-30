import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { clinicHeader, nursingHomeHeader } from '../../../fixtures/site';
import { StatusTag } from '../../atoms/StatusTag';
import { TextLink } from '../../atoms/TextLink';
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
    // Below 1024px the menu sits behind the Menu button: open it first.
    const menu = canvas.queryByRole('button', { name: 'Menu' });
    if (menu) await userEvent.click(menu);
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
    {/* Running, not finished: info, never the success green. It names the one batch it runs for, whole (the batch
        name never breaks), at the body size. */}
    <StatusTag tone="info">Gửi tự động: chỉ đợt F.D.I{'\u00a0'}KSK{'\u00a0'}2026</StatusTag>
    <span>Chị Lan</span>
    <TextLink href="#" arrow={false}>
      Đăng xuất
    </TextLink>
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

/** The thin bar's person: the name first, then each fact as its own element (kept whole, set apart by space). */
const workingOn = (
  <>
    <strong>Đặng Thanh Chi</strong>
    <span>Sinh 07/07/1990</span>
    <span>RD26-0006</span>
  </>
);

/**
 * Scrolled down on a phone: the logo row shrinks to a thin sticky bar that keeps who is being worked on: the name,
 * then "Sinh 07/07/1990" and "RD26-0006" as whole chunks on one line. The thin bar is never taller than the full row;
 * on a narrow phone the Menu button keeps only its icon so the facts fit.
 */
export const StaffCollapsesOnScroll: Story = {
  args: { ...staffHeader, collapseOnScroll: true, compactBar: workingOn },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <>
      <Header {...args} />
      <main style={{ padding: 'var(--space-20) var(--space-15)', minBlockSize: '200vh' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>Đặng Thanh Chi</h1>
        <p style={{ display: 'flex', flexWrap: 'wrap', gap: '0 var(--space-15)' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Nữ</span>
          <span style={{ whiteSpace: 'nowrap' }}>Sinh 07/07/1990</span>
          <span style={{ whiteSpace: 'nowrap' }}>
            Mã lượt khám <strong>RD26-0006</strong>
          </span>
        </p>
      </main>
    </>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('header')!;
    await expect(header).not.toHaveAttribute('data-collapsed');
    const fullRow = header.getBoundingClientRect().height;
    window.scrollTo({ top: 400, behavior: 'instant' });
    window.dispatchEvent(new Event('scroll'));
    await new Promise((r) => setTimeout(r, 50));
    await expect(header).toHaveAttribute('data-collapsed', 'true');
    // Below 1024px the thin bar shows; it is never taller than the full row, and the menu keeps its name.
    if (window.innerWidth < 1024) {
      await expect(header.getBoundingClientRect().height).toBeLessThanOrEqual(fullRow);
      await expect(within(header).getByRole('button', { name: 'Menu' })).toBeVisible();
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.dispatchEvent(new Event('scroll'));
    await new Promise((r) => setTimeout(r, 50));
    await expect(header).not.toHaveAttribute('data-collapsed');
  },
};
