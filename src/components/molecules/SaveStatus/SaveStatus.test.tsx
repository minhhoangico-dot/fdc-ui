import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveStatus } from './SaveStatus';

const root = (c: HTMLElement) => c.querySelector('[data-component="SaveStatus"]') as HTMLElement;
/** What a screen reader reads from the line, in order: the text outside aria-hidden parts. */
const heard = (el: Element): string =>
  Array.from(el.childNodes)
    .map((n) => (n.nodeType === Node.TEXT_NODE ? n.textContent : n instanceof Element && n.getAttribute('aria-hidden') !== 'true' ? heard(n) : ''))
    .join('');

describe('SaveStatus', () => {
  it('counts unsaved fields with the last save time', () => {
    const { container } = render(<SaveStatus status={{ state: 'unsaved', count: 8, lastSavedAt: '09:12' }} />);
    // The dot between the two is drawn in the gap (CSS), so a wrapped line never starts or ends with it.
    expect(heard(root(container))).toBe('8 ô chưa lưuLưu lần cuối 09:12');
    expect(screen.getByText('8 ô chưa lưu')).toBeInTheDocument();
    expect(screen.getByText('Lưu lần cuối 09:12')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/^ô chưa lưu$/);
  });

  it('shows saving and saved', () => {
    const { rerender } = render(<SaveStatus status={{ state: 'saving' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Đang lưu…');
    rerender(<SaveStatus status={{ state: 'saved', at: '09:15' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Đã lưu 09:15');
  });

  it('announces a failed save at once, keeps the data and offers to retry', async () => {
    const onRetry = vi.fn();
    const { container } = render(<SaveStatus status={{ state: 'error', reason: 'mất mạng', count: 8 }} onRetry={onRetry} />);
    expect(root(container)).toHaveTextContent('Lưu không được: mất mạng. Chữ đã gõ vẫn còn (8 ô chưa lưu).');
    await userEvent.click(screen.getByRole('button', { name: 'Lưu lại' }));
    expect(onRetry).toHaveBeenCalled();
  });
});

describe('SaveStatus v2.4 one live region per change', () => {
  it('reads a failed save once: the alert alone holds it, the polite region is empty, the button is outside both', () => {
    render(<SaveStatus status={{ state: 'error', reason: 'mất mạng', count: 8 }} onRetry={() => {}} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/^Lưu không được: mất mạng\. Chữ đã gõ vẫn còn$/);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(alert.closest('[role="status"]')).toBeNull();
    const button = screen.getByRole('button', { name: 'Lưu lại' });
    expect(button.closest('[role="status"], [role="alert"]')).toBeNull();
  });

  it('does not read the failure again when the count of unsaved fields changes', () => {
    const { container, rerender } = render(<SaveStatus status={{ state: 'error', reason: 'mất mạng', count: 1 }} />);
    const alert = screen.getByRole('alert');
    const said = alert.textContent;
    rerender(<SaveStatus status={{ state: 'error', reason: 'mất mạng', count: 2 }} />);
    expect(screen.getByRole('alert')).toBe(alert);
    expect(alert.textContent).toBe(said);
    expect(root(container)).toHaveTextContent('(2 ô chưa lưu).');
  });

  it('has no alert outside the failure, and the polite region stays the same element', () => {
    const { rerender } = render(<SaveStatus status={{ state: 'unsaved', count: 1 }} />);
    const status = screen.getByRole('status');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    rerender(<SaveStatus status={{ state: 'error', reason: 'mất mạng', count: 1 }} />);
    expect(screen.getByRole('status')).toBe(status);
    rerender(<SaveStatus status={{ state: 'saving' }} />);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Đang lưu…');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the "!" sign on a failed save and on a conflict, hidden from screen readers; not on the others', () => {
    const { container, rerender } = render(<SaveStatus status={{ state: 'error', reason: 'mất mạng' }} />);
    const mark = () => container.querySelector('[data-part="mark"]');
    expect(mark()).toHaveTextContent('!');
    expect(mark()).toHaveAttribute('aria-hidden', 'true');
    rerender(<SaveStatus status={{ state: 'conflict', count: 1 }} />);
    expect(mark()).toHaveTextContent('!');
    expect(screen.getByRole('status')).not.toHaveTextContent('!');
    rerender(<SaveStatus status={{ state: 'unsaved', count: 1 }} />);
    expect(mark()).toBeNull();
    rerender(<SaveStatus status={{ state: 'saved' }} />);
    expect(mark()).toBeNull();
  });
});

describe('SaveStatus v2.4 conflict', () => {
  it('asks to settle the conflicting values, with the last save time, politely', () => {
    const { container } = render(<SaveStatus status={{ state: 'conflict', count: 2, lastSavedAt: '09:12' }} />);
    expect(root(container)).toHaveAttribute('data-state', 'conflict');
    expect(screen.getByText('Cần xử lý 2 giá trị trước khi lưu')).toBeInTheDocument();
    expect(heard(root(container))).toBe('Cần xử lý 2 giá trị trước khi lưuLưu lần cuối 09:12');
    expect(screen.getByRole('status')).toHaveTextContent(/^Cần xử lý$/);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('never says it is saved: no "Đã lưu", no check mark', () => {
    const { container } = render(<SaveStatus status={{ state: 'conflict', count: 1 }} />);
    expect(heard(root(container))).toBe('Cần xử lý 1 giá trị trước khi lưu');
    expect(root(container)).not.toHaveTextContent(/Đã lưu|✓/);
  });
});

describe('SaveStatus v2.4 reads moments, not counts', () => {
  it('a new count changes the line, not what the polite region says; a new state does', () => {
    const { container, rerender } = render(<SaveStatus status={{ state: 'saved', at: '09:12' }} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/^Đã lưu 09:12$/);
    rerender(<SaveStatus status={{ state: 'unsaved', count: 1, lastSavedAt: '09:12' }} />);
    expect(status).toHaveTextContent(/^ô chưa lưu$/);
    const said = status.innerHTML;
    for (const count of [2, 3, 12]) {
      rerender(<SaveStatus status={{ state: 'unsaved', count, lastSavedAt: '09:12' }} />);
      expect(screen.getByRole('status')).toBe(status);
      expect(status.innerHTML).toBe(said);
      expect(screen.getByText(`${count} ô chưa lưu`)).toBeInTheDocument();
      expect(heard(root(container))).toBe(`${count} ô chưa lưuLưu lần cuối 09:12`);
    }
    rerender(<SaveStatus status={{ state: 'saving' }} />);
    expect(status).toHaveTextContent(/^Đang lưu…$/);
    rerender(<SaveStatus status={{ state: 'conflict', count: 2 }} />);
    expect(status).toHaveTextContent(/^Cần xử lý$/);
    rerender(<SaveStatus status={{ state: 'conflict', count: 1 }} />);
    expect(status).toHaveTextContent(/^Cần xử lý$/);
    expect(screen.getByText('Cần xử lý 1 giá trị trước khi lưu')).toBeInTheDocument();
  });

  it('the words with a count show once for the eye and are heard once, in their order', () => {
    const { container } = render(<SaveStatus status={{ state: 'unsaved', count: 3 }} />);
    const shown = screen.getByText('3 ô chưa lưu');
    expect(shown).toHaveAttribute('aria-hidden', 'true');
    expect(shown.closest('[role="status"]')).toBeNull();
    expect(heard(root(container))).toBe('3 ô chưa lưu');
  });
});
