import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';

it('opens as a labelled dialog and closes when open becomes false', () => {
  const { rerender } = render(<Dialog open onClose={() => {}} title="Hủy lịch khám?"><p>Lịch sẽ bị hủy.</p></Dialog>);
  const dialog = screen.getByRole('dialog', { name: 'Hủy lịch khám?' });
  expect(dialog).toHaveAttribute('open');
  expect(dialog).toHaveAccessibleDescription('Lịch sẽ bị hủy.');
  rerender(<Dialog open={false} onClose={() => {}} title="Hủy lịch khám?" />);
  expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
});

it('uses alertdialog for warnings', () => {
  render(<Dialog open alert onClose={() => {}} title="Sắp hết phiên" />);
  expect(screen.getByRole('alertdialog', { name: 'Sắp hết phiên' })).toBeInTheDocument();
});

it('closes on Escape and returns focus to the button that opened it', async () => {
  function Demo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Mở</button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Hỏi">
          <button>Trong hộp thoại</button>
        </Dialog>
      </>
    );
  }
  render(<Demo />);
  const trigger = screen.getByRole('button', { name: 'Mở' });
  await userEvent.click(trigger);
  screen.getByRole('button', { name: 'Trong hộp thoại' }).focus();
  await userEvent.keyboard('{Escape}');
  expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  expect(trigger).toHaveFocus();
});

it('wide + scrollBody: a named, keyboard-scrollable body between the title and fixed actions', () => {
  render(
    <Dialog open onClose={() => {}} title="Gửi 24 hồ sơ lên Sở?" size="wide" scrollBody actions={<button>Gửi 24 hồ sơ</button>}>
      <ul>
        {Array.from({ length: 24 }, (_, i) => (
          <li key={i}>Hồ sơ {i + 1}</li>
        ))}
      </ul>
    </Dialog>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Gửi 24 hồ sơ lên Sở?' });
  expect(dialog).toHaveAttribute('data-size', 'wide');
  expect(dialog).toHaveAttribute('data-scroll-body', 'true');
  expect(dialog).not.toHaveAttribute('aria-describedby');
  const body = screen.getByRole('region', { name: 'Gửi 24 hồ sơ lên Sở?' });
  expect(body).toHaveAttribute('tabindex', '0');
  expect(body).toContainElement(screen.getByText('Hồ sơ 24'));
  // Actions sit outside the scrolling body, so they never scroll away.
  expect(body).not.toContainElement(screen.getByRole('button', { name: 'Gửi 24 hồ sơ' }));
});
