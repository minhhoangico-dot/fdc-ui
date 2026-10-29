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
});
