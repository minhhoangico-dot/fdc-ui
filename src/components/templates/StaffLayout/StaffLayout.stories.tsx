import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { staffHeader } from '../../../fixtures/staff';
import { FormPartNav } from '../../molecules/FormPartNav';
import { SaveStatus } from '../../molecules/SaveStatus';
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
