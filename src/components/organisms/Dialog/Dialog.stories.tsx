import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../../atoms/Button';
import { Dialog } from './Dialog';

const meta = {
  title: 'Organisms/Dialog',
  component: Dialog,
  tags: ['beta'],
  args: { open: false, onClose: () => {}, title: 'Hủy lịch khám?' },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Hủy lịch</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button variant="primary" onClick={() => setOpen(false)}>Giữ lịch khám</Button>
              <Button onClick={() => setOpen(false)}>Hủy lịch</Button>
            </>
          }
        >
          <p>Lịch khám thứ Bảy 24/10 lúc 09:30 sẽ bị hủy. Bạn có thể đặt lại bất cứ lúc nào.</p>
        </Dialog>
      </>
    );
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const EscClosesAndReturnsFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Hủy lịch' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

const people = Array.from({ length: 24 }, (_, i) => ({
  name: ['Phạm Văn Nam', 'Đặng Thanh Chi', 'Nguyễn Thị Lan', 'Tôn Thất Nguyễn Hoàng Phương Quỳnh'][i % 4],
  code: `TESTA-${String(i + 1).padStart(4, '0')}`,
  dob: `0${(i % 9) + 1}/0${(i % 8) + 1}/19${60 + (i % 35)}`,
}));

/** Wide dialog with a long list: the body scrolls, the buttons stay at the bottom, a fade shows there is more. */
export const WideScrollingList: Story = {
  args: { title: 'Gửi 24 hồ sơ lên Sở?' },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Xem danh sách gửi</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          size="wide"
          scrollBody
          actions={
            <>
              <Button variant="primary" onClick={() => setOpen(false)}>Gửi 24 hồ sơ</Button>
              <Button onClick={() => setOpen(false)}>Quay lại</Button>
            </>
          }
        >
          <table style={{ inlineSize: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)' }}>
                <th scope="col" style={{ textAlign: 'left', padding: 'var(--space-5) var(--space-10)' }}>Họ và tên</th>
                <th scope="col" style={{ textAlign: 'left', padding: 'var(--space-5) var(--space-10)' }}>Ngày sinh</th>
                <th scope="col" style={{ textAlign: 'left', padding: 'var(--space-5) var(--space-10)' }}>Mã hồ sơ</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.code} style={{ borderBlockStart: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--space-5) var(--space-10)' }}>{p.name}</td>
                  <td style={{ padding: 'var(--space-5) var(--space-10)' }}>{p.dob}</td>
                  <td style={{ padding: 'var(--space-5) var(--space-10)' }}>{p.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Dialog>
      </>
    );
  },
};
