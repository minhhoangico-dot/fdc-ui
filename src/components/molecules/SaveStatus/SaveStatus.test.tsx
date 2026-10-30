import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveStatus } from './SaveStatus';

describe('SaveStatus', () => {
  it('counts unsaved fields with the last save time', () => {
    render(<SaveStatus status={{ state: 'unsaved', count: 8, lastSavedAt: '09:12' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('8 ô chưa lưu · Lưu lần cuối 09:12');
  });

  it('shows saving and saved', () => {
    const { rerender } = render(<SaveStatus status={{ state: 'saving' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Đang lưu…');
    rerender(<SaveStatus status={{ state: 'saved', at: '09:15' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Đã lưu 09:15');
  });

  it('announces a failed save at once, keeps the data and offers to retry', async () => {
    const onRetry = vi.fn();
    render(<SaveStatus status={{ state: 'error', reason: 'mất mạng', count: 8 }} onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Lưu không được: mất mạng. Chữ đã gõ vẫn còn (8 ô chưa lưu).');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu lại' }));
    expect(onRetry).toHaveBeenCalled();
  });
});

describe('SaveStatus v2.4 conflict', () => {
  it('asks to settle the conflicting values, with the last save time, politely', () => {
    render(<SaveStatus status={{ state: 'conflict', count: 2, lastSavedAt: '09:12' }} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('data-state', 'conflict');
    expect(status).toHaveTextContent('Cần xử lý 2 giá trị trước khi lưu · Lưu lần cuối 09:12');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('never says it is saved: no "Đã lưu", no check mark', () => {
    render(<SaveStatus status={{ state: 'conflict', count: 1 }} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/^Cần xử lý 1 giá trị trước khi lưu$/);
    expect(status).not.toHaveTextContent(/Đã lưu|✓/);
  });
});
