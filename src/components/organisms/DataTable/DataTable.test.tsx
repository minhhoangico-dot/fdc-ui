import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeRecords } from '../../../fixtures/ksk';
import { recordColumns } from '../../../fixtures/kskTable';
import { DataTable } from './DataTable';

const rows = makeRecords(12);
const base = { caption: 'Người cần điền hoặc sửa', columns: recordColumns, getRowKey: (r: (typeof rows)[number]) => r.recordCode };

describe('DataTable', () => {
  it('is a captioned table with column headers and the name as row header', () => {
    render(<DataTable {...base} rows={rows} />);
    const table = screen.getByRole('table', { name: 'Người cần điền hoặc sửa' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['STT', 'Họ tên', 'Mã lượt khám', 'Trạng thái', 'Việc tiếp theo']);
    expect(within(table).getByRole('rowheader', { name: /Tôn Nữ Hoàng Bảo Ngọc Phương Thảo/ })).toBeInTheDocument();
    expect(within(table).getAllByRole('row')).toHaveLength(13);
  });

  it('keeps the header and says it is loading', () => {
    render(<DataTable {...base} rows={[]} status="loading" />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Đang tải danh sách…')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
  });

  it('says what failed and offers to try again', async () => {
    const onRetry = vi.fn();
    render(<DataTable {...base} rows={[]} status="error" errorText="Không tải được danh sách: mất mạng." onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Không tải được danh sách: mất mạng.');
    await userEvent.click(screen.getByRole('button', { name: 'Tải lại' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('explains an empty result and hides paging', () => {
    render(<DataTable {...base} rows={[]} emptyText="Không có ai khớp “Hằng”." pagination={{ page: 1, pageSize: 50, total: 0 }} />);
    expect(screen.getByText('Không có ai khớp “Hằng”.')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('shows paging under the rows', () => {
    render(<DataTable {...base} rows={rows} pagination={{ page: 1, pageSize: 12, total: 2033, itemLabel: 'người', getHref: (p) => `?p=${p}` }} />);
    expect(screen.getByRole('navigation', { name: 'Trang của danh sách' })).toHaveTextContent('Hiển thị 1–12 trong 2.033 người');
  });

  it('is a plain table with no stacking labels by default', () => {
    render(<DataTable {...base} rows={rows} />);
    expect(screen.getByRole('table')).not.toHaveAttribute('role');
    expect(screen.getAllByText('Mã lượt khám')).toHaveLength(1);
  });

  it('states every table role when it stacks on phones, and labels each line with its column', () => {
    const columns = recordColumns.map((c) =>
      c.key === 'status' ? { ...c, hideLabelWhenStacked: true } : c.key === 'next' ? { ...c, stackLabel: 'Tiếp theo' } : c,
    );
    render(<DataTable {...base} columns={columns} rows={rows.slice(0, 2)} stackBelow="phone" />);
    const table = screen.getByRole('table', { name: 'Người cần điền hoặc sửa' });
    expect(table).toHaveAttribute('role', 'table');
    expect(table.querySelectorAll('thead[role="rowgroup"], tbody[role="rowgroup"]')).toHaveLength(2);
    for (const h of within(table).getAllByRole('columnheader')) expect(h).toHaveAttribute('role', 'columnheader');

    const row = within(table).getAllByRole('row')[1];
    expect(row).toHaveAttribute('role', 'row');
    // The name is the block's title: a row header with its link first, no label.
    const title = within(row).getByRole('rowheader');
    expect(title).toHaveAttribute('role', 'rowheader');
    expect(title.firstElementChild?.tagName).toBe('A');

    const cells = within(row).getAllByRole('cell');
    for (const c of cells) expect(c).toHaveAttribute('role', 'cell');
    const labels = cells.map((c) => c.querySelector(':scope > [aria-hidden="true"]')?.textContent ?? null);
    expect(labels).toEqual(['STT', 'Mã lượt khám', null, 'Tiếp theo']);
    // The label is visible copy only: the column header still names the cell, so it is not read twice.
    expect(within(row).getByRole('cell', { name: rows[0].recordCode })).toBeInTheDocument();
  });

  it('keeps the roles on its message row while it stacks', () => {
    render(<DataTable {...base} rows={[]} status="loading" stackBelow="phone" />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('cell', { name: 'Đang tải danh sách…' })).toHaveAttribute('role', 'cell');
  });
});
