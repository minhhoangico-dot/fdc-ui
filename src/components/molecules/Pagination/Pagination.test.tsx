import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, pageRange, rangeText } from './Pagination';

describe('Pagination', () => {
  it('says what is shown with Vietnamese number grouping', () => {
    render(<Pagination page={1} pageSize={50} total={2033} itemLabel="người" getHref={(p) => `?trang=${p}`} />);
    const nav = screen.getByRole('navigation', { name: 'Trang của danh sách' });
    expect(nav).toHaveTextContent('Hiển thị 1–50 trong 2.033 người');
    expect(nav).toHaveTextContent('Trang 1 / 41');
    expect(screen.queryByRole('link', { name: /Trước/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sau' })).toHaveAttribute('href', '?trang=2');
  });

  it('names the controls by their words: the arrows are for the eye only', () => {
    render(<Pagination page={12} pageSize={50} total={2033} getHref={(p) => `?trang=${p}`} />);
    for (const name of ['Trước', 'Sau']) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveTextContent(name === 'Trước' ? '‹ Trước' : 'Sau ›');
      expect(link.querySelector('[aria-hidden="true"]')).toHaveTextContent(name === 'Trước' ? '‹' : '›');
    }
  });

  it('uses buttons when there are no addresses, and stops at the last page', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={41} pageSize={50} total={2033} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation')).toHaveTextContent('Hiển thị 2.001–2.033 trong 2.033 dòng');
    expect(screen.queryByRole('button', { name: /Sau/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(onPageChange).toHaveBeenCalledWith(40);
  });

  it('announces the range line by default, and not when live is false (DataTable says it once instead)', () => {
    const { rerender } = render(<Pagination page={1} pageSize={50} total={2033} />);
    expect(screen.getByText(/Hiển thị/)).toHaveAttribute('aria-live', 'polite');
    rerender(<Pagination page={1} pageSize={50} total={2033} live={false} />);
    expect(screen.getByText(/Hiển thị/)).not.toHaveAttribute('aria-live');
  });

  it('works out the range the way it shows it', () => {
    expect(pageRange(99, 50, 2033)).toEqual({ pages: 41, current: 41, from: 2001, to: 2033 });
    expect(rangeText({ page: 2, pageSize: 50, total: 2033, itemLabel: 'người' })).toBe('Hiển thị 51–100 trong 2.033 người');
  });

  it('hides the controls on a single page and renders nothing when empty', () => {
    const { container, rerender } = render(<Pagination page={1} pageSize={50} total={13} />);
    expect(screen.queryByText(/Trang/)).not.toBeInTheDocument();
    rerender(<Pagination page={1} pageSize={50} total={0} />);
    expect(container).toBeEmptyDOMElement();
  });
});
