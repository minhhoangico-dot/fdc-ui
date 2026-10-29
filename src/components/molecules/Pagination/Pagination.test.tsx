import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('says what is shown with Vietnamese number grouping', () => {
    render(<Pagination page={1} pageSize={50} total={2033} itemLabel="người" getHref={(p) => `?trang=${p}`} />);
    const nav = screen.getByRole('navigation', { name: 'Trang của danh sách' });
    expect(nav).toHaveTextContent('Hiển thị 1–50 trong 2.033 người');
    expect(nav).toHaveTextContent('Trang 1 / 41');
    expect(screen.queryByRole('link', { name: /Trước/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sau ›' })).toHaveAttribute('href', '?trang=2');
  });

  it('uses buttons when there are no addresses, and stops at the last page', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={41} pageSize={50} total={2033} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation')).toHaveTextContent('Hiển thị 2.001–2.033 trong 2.033 dòng');
    expect(screen.queryByRole('button', { name: /Sau/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '‹ Trước' }));
    expect(onPageChange).toHaveBeenCalledWith(40);
  });

  it('hides the controls on a single page and renders nothing when empty', () => {
    const { container, rerender } = render(<Pagination page={1} pageSize={50} total={13} />);
    expect(screen.queryByText(/Trang/)).not.toBeInTheDocument();
    rerender(<Pagination page={1} pageSize={50} total={0} />);
    expect(container).toBeEmptyDOMElement();
  });
});
