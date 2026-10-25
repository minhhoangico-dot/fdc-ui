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
