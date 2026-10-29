import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { staffHeader } from '../../../fixtures/staff';
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

/** With a side column and the sticky action bar (the one block with a shadow, because it floats). */
export const WithAsideAndActionBar: Story = {
  args: {
    aside: <p style={{ margin: 0, padding: 'var(--space-15)', background: 'var(--surface)', border: '1px solid var(--border)' }}>Các phần của phiếu</p>,
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
