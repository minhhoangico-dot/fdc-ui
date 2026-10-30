import type { Meta, StoryObj } from '@storybook/react';
import { expect, waitFor } from '@storybook/test';
import { Button } from '../../atoms/Button';
import { StatusTag } from '../../atoms/StatusTag';
import { staffHeader } from '../../../fixtures/staff';
import { FormPartNav } from '../../molecules/FormPartNav';
import { SaveStatus } from '../../molecules/SaveStatus';
import { PatientContextBar } from '../../organisms/PatientContextBar';
import { StaffLayout } from './StaffLayout';

const meta = {
  title: 'Templates/StaffLayout',
  component: StaffLayout,
  parameters: { layout: 'fullscreen', density: 'compact' },
  args: {
    header: staffHeader,
    children: (
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-20)' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>Việc của tôi</h1>
        <p>Nội dung trang nằm trên nền xám; mỗi khối là một mặt trắng có viền, không đổ bóng.</p>
      </section>
    ),
  },
} satisfies Meta<typeof StaffLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * With the form's parts in the side column (a FormPartNav: the full list from 1024px, one toggle on phones)
 * and the sticky action bar (the one block with a shadow, because it floats).
 */
export const WithAsideAndActionBar: Story = {
  args: {
    aside: (
      <FormPartNav
        items={[
          { label: '1. Hành chính', href: '#', done: true },
          { label: '2. Lần khám', href: '#', done: true },
          { label: '3. Tiền sử', href: '#', count: 'còn 17' },
          { label: '4. Thể lực', href: '#', count: 'còn 2', current: true },
          { label: '5. Lâm sàng', href: '#', count: 'còn 25' },
          { label: '6. Cận lâm sàng', href: '#', done: true, sub: '12 chỉ số từ HIS, 09:12' },
          { label: '7. Kết luận', href: '#', count: 'còn 2' },
        ]}
      />
    ),
    actionBar: (
      <>
        <span style={{ flex: '1 1 16rem' }}>
          Còn <strong>47 mục</strong> ở 4 phần
        </span>
        <SaveStatus status={{ state: 'unsaved', count: 8, lastSavedAt: '09:12' }} />
        <Button variant="primary">Lưu</Button>
      </>
    ),
  },
};

/** A phone: the parts are one toggle above the form, and the spacing is tighter, so the work area starts sooner. */
export const WithAsideOnPhone: Story = { ...WithAsideAndActionBar, parameters: { viewport: { defaultViewport: 'mobile1' } } };

/**
 * A record form: the person in a sticky PatientContextBar (from 1024px; below that the header's thin bar holds the
 * person), the parts beside the form and the action bar. StaffLayout measures the bars that stick and writes their
 * heights as --header-space, --context-bar-space and --action-bar-space: the scroll padding and the side column's
 * sticky top follow them, so a focused field never lands under a bar at any width.
 */
export const RecordForm: Story = {
  args: {
    ...WithAsideAndActionBar.args,
    header: {
      ...staffHeader,
      collapseOnScroll: true,
      compactBar: (
        <>
          <strong>Đặng Thanh Chi</strong>
          <span>Sinh 07/07/1990</span>
          <span>RD26-0006</span>
        </>
      ),
    },
    context: (
      <PatientContextBar
        sticky
        name="Đặng Thanh Chi"
        sex="Nữ"
        birthDate="07/07/1990"
        ageOn={new Date(2026, 9, 10)}
        idEnd="0006"
        recordCode="RD26-0006"
        organization="Công ty TNHH Rạng Đông"
        breadcrumb={[
          { label: 'Việc của tôi', href: '#' },
          { label: 'Rạng Đông KSK 2026', href: '#' },
          { label: 'Người 6 / 2.033' },
        ]}
        status={<StatusTag>Cần điền · còn 48 mục</StatusTag>}
        actions={
          <>
            <Button icon="simple-left" href="#" aria-label="Người trước: Ngô Văn Nam">
              Người trước
            </Button>
            <Button icon="simple-right" iconPosition="end" href="#" aria-label="Người sau: Nguyễn Thị Mai Anh">
              Người sau
            </Button>
          </>
        }
      />
    ),
    children: (
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-20)', minBlockSize: '150vh' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>4. Thể lực</h2>
        <p>Các ô của phần này nằm ở đây.</p>
      </section>
    ),
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-component="StaffLayout"]')!;
    const bar = root.querySelector<HTMLElement>('section[aria-label="Lưu và chuyển bước"]')!;
    // The action bar's real height, rounded up, is what the bottom scroll padding keeps clear.
    await waitFor(() => expect(root.style.getPropertyValue('--action-bar-space')).toBe(`${Math.ceil(bar.getBoundingClientRect().height)}px`));
    const html = getComputedStyle(document.documentElement);
    await expect(parseFloat(html.scrollPaddingBottom)).toBeGreaterThan(bar.getBoundingClientRect().height);
    const ctx = root.querySelector<HTMLElement>('[data-component="PatientContextBar"]')!;
    if (getComputedStyle(ctx).position === 'sticky') {
      await expect(parseFloat(html.scrollPaddingTop)).toBeGreaterThan(ctx.getBoundingClientRect().height);
      const aside = root.querySelector<HTMLElement>('nav[aria-label="Các phần của phiếu"]')!;
      await expect(parseFloat(getComputedStyle(aside).top)).toBeGreaterThan(ctx.getBoundingClientRect().height);
    }
  },
};
