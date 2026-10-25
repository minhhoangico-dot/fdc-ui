import { act, fireEvent, render, screen } from '@testing-library/react';
import { formatRemaining, IdleTimeoutDialog } from './IdleTimeoutDialog';

describe('IdleTimeoutDialog', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('warns before the timeout, lets the person continue, then times out if ignored', () => {
    const onTimeout = vi.fn();
    const onStay = vi.fn();
    render(<IdleTimeoutDialog timeoutMs={180_000} warnBeforeMs={120_000} onTimeout={onTimeout} onStay={onStay} />);
    expect(screen.queryByRole('alertdialog')).toBeNull();

    act(() => vi.advanceTimersByTime(61_000));
    expect(screen.getByRole('alertdialog', { name: 'Bạn vẫn đang ở đây chứ?' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Còn 2 phút');

    fireEvent.click(screen.getByRole('button', { name: 'Tiếp tục' }));
    expect(onStay).toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).toBeNull();

    act(() => vi.advanceTimersByTime(181_000));
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('ignores activity once the warning is showing', () => {
    const onTimeout = vi.fn();
    render(<IdleTimeoutDialog timeoutMs={60_000} warnBeforeMs={30_000} onTimeout={onTimeout} />);
    act(() => vi.advanceTimersByTime(31_000));
    fireEvent.keyDown(window, { key: 'a' });
    act(() => vi.advanceTimersByTime(30_000));
    expect(onTimeout).toHaveBeenCalled();
  });

  it('formats remaining time in words', () => {
    expect(formatRemaining(125_000)).toBe('2 phút 05 giây');
    expect(formatRemaining(120_000)).toBe('2 phút');
    expect(formatRemaining(9_200)).toBe('10 giây');
  });
});
