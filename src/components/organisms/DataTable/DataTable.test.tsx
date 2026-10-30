import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { makeRecords } from '../../../fixtures/ksk';
import { recordColumns } from '../../../fixtures/kskTable';
import { DataTable } from './DataTable';

const rows = makeRecords(12);
const base = { caption: 'Người cần điền hoặc sửa', columns: recordColumns, getRowKey: (r: (typeof rows)[number]) => r.recordCode };
const live = (container: HTMLElement) => within(container.querySelector<HTMLElement>('[data-component="DataTable"]')!).getByRole('status');

describe('DataTable', () => {
  it('is a captioned table with column headers and the name as row header', () => {
    render(<DataTable {...base} rows={rows} />);
    const table = screen.getByRole('table', { name: 'Người cần điền hoặc sửa' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['STT', 'Họ tên', 'Mã lượt khám', 'Trạng thái', 'Việc tiếp theo']);
    expect(within(table).getByRole('rowheader', { name: /Tôn Nữ Hoàng Bảo Ngọc Phương Thảo/ })).toBeInTheDocument();
    expect(within(table).getAllByRole('row')).toHaveLength(13);
  });

  it('is boxed by default, and plain (rows and dividers only) for a table inside a card', () => {
    const { container, rerender } = render(<DataTable {...base} rows={rows} />);
    expect(container.querySelector('[data-component="DataTable"]')).toHaveAttribute('data-variant', 'boxed');
    rerender(<DataTable {...base} rows={rows} variant="plain" />);
    expect(container.querySelector('[data-component="DataTable"]')).toHaveAttribute('data-variant', 'plain');
  });

  it('keeps the header and says it is loading, outside the table', () => {
    const { container } = render(<DataTable {...base} rows={[]} status="loading" />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
    // The message is under the table, not a row of it, so it never scrolls sideways out of view.
    expect(within(table).queryByText('Đang tải danh sách…')).not.toBeInTheDocument();
    expect(container.querySelector('[data-component="DataTable"] > [tabindex="-1"]')).toHaveTextContent('Đang tải danh sách…');
    expect(live(container)).toHaveTextContent('Đang tải danh sách…');
  });

  it('says what failed with a sign, in its one polite live region, and offers to try again', async () => {
    const onRetry = vi.fn();
    const { container } = render(<DataTable {...base} rows={[]} status="error" errorText="Không tải được danh sách: mất mạng." onRetry={onRetry} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(live(container)).toHaveTextContent('Không tải được danh sách: mất mạng.');
    const message = container.querySelector('[data-component="DataTable"] > [data-tone="error"]')!;
    expect(message.querySelector('[aria-hidden="true"]')).toHaveTextContent('!');
    await userEvent.click(screen.getByRole('button', { name: 'Tải lại' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('moves focus to the first row link after "Tải lại", not to the page body', async () => {
    function Retry() {
      const [failed, setFailed] = useState(true);
      return <DataTable {...base} rows={failed ? [] : rows} status={failed ? 'error' : 'ready'} onRetry={() => setFailed(false)} />;
    }
    render(<Retry />);
    await userEvent.click(screen.getByRole('button', { name: 'Tải lại' }));
    expect(screen.getByRole('link', { name: rows[0].name })).toHaveFocus();
  });

  it('explains an empty result, says it in the live region, and hides paging', () => {
    const { container } = render(<DataTable {...base} rows={[]} emptyText="Không có ai khớp “Hằng”." pagination={{ page: 1, pageSize: 50, total: 0 }} />);
    expect(screen.getByText('Không có ai khớp “Hằng”.', { selector: '[tabindex="-1"]' })).toBeInTheDocument();
    expect(live(container)).toHaveTextContent('Không có ai khớp “Hằng”.');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('says nothing when it opens with rows, then says the caption and the count on every change, once', () => {
    const pagination = { page: 1, pageSize: 12, total: 2033, itemLabel: 'người', getHref: (p: number) => `?p=${p}` };
    const { container, rerender } = render(<DataTable {...base} rows={rows} pagination={pagination} />);
    expect(live(container)).toHaveTextContent('');
    rerender(<DataTable {...base} rows={rows} pagination={{ ...pagination, page: 2 }} />);
    expect(live(container)).toHaveTextContent('Người cần điền hoặc sửa: hiển thị 13–24 trong 2.033 người.');
    rerender(<DataTable {...base} rows={[]} emptyText="Không có ai khớp “Hằng”." resultNote="Còn 1 người khớp “Hằng” ở nhóm khác." />);
    expect(live(container)).toHaveTextContent('Không có ai khớp “Hằng”. Còn 1 người khớp “Hằng” ở nhóm khác.');
    // The range line under the rows is not a second live region.
    rerender(<DataTable {...base} rows={rows} pagination={pagination} />);
    expect(screen.getByRole('navigation', { name: 'Trang của danh sách' }).querySelector('[aria-live]')).toBeNull();
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

  it('states every table role when it stacks on phones, is named by its caption alone, and lines up each value', () => {
    const columns = recordColumns.map((c) => (c.key === 'next' ? { ...c, stackLabel: 'Tiếp theo' } : c));
    render(<DataTable {...base} columns={columns} rows={rows.slice(0, 2)} stackBelow="phone" />);
    const table = screen.getByRole('table', { name: 'Người cần điền hoặc sửa' });
    expect(table).toHaveAttribute('role', 'table');
    // The <caption> names it; aria-labelledby on top would make the caption its description too.
    expect(table).not.toHaveAttribute('aria-labelledby');
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
    // The state tag has no label, but keeps the (empty) label column, so it lines up with the other values.
    expect(labels).toEqual(['STT', 'Mã lượt khám', '', 'Tiếp theo']);
    // The label is visible copy only: the column header still names the cell, so it is not read twice.
    expect(within(row).getByRole('cell', { name: rows[0].recordCode })).toBeInTheDocument();
  });

  it('with no rows is never a scroll container or a Tab stop, so Chrome cannot make it one either', () => {
    const scrollerOf = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-component="DataTable"] > div')!;
    const { container, rerender } = render(<DataTable {...base} rows={[]} status="loading" stackBelow="phone" />);
    for (const status of ['loading', 'error', 'ready'] as const) {
      rerender(<DataTable {...base} rows={[]} status={status} stackBelow="phone" />);
      expect(scrollerOf(container)).toHaveAttribute('data-still');
      expect(scrollerOf(container)).not.toHaveAttribute('tabindex');
      expect(scrollerOf(container)).not.toHaveAttribute('role');
    }
    rerender(<DataTable {...base} rows={rows} stackBelow="phone" />);
    expect(scrollerOf(container)).not.toHaveAttribute('data-still');
  });

  describe('in a box narrower than the table', () => {
    // jsdom has no layout: the table is 768px wide (48rem), its box 300px (a phone).
    let restore: () => void;
    beforeEach(() => {
      const offset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')!;
      const client = Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth')!;
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get() { return this.tagName === 'TABLE' ? 768 : 0; } });
      Object.defineProperty(Element.prototype, 'clientWidth', { configurable: true, get() { return 300; } });
      restore = () => {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offset);
        Object.defineProperty(Element.prototype, 'clientWidth', client);
      };
    });
    afterEach(() => restore());

    it('scrolls sideways as a labelled region with rows, and keeps the header', () => {
      render(<DataTable {...base} rows={rows} />);
      const region = screen.getByRole('region', { name: 'Người cần điền hoặc sửa' });
      expect(region).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('table')).not.toHaveAttribute('data-headless');
    });

    it('with no rows keeps the header for screen readers only, so it is never cut at the edge', () => {
      const { rerender } = render(<DataTable {...base} rows={[]} status="error" errorText="Không tải được danh sách: mất mạng." />);
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('data-headless');
      expect(within(table).getAllByRole('columnheader')).toHaveLength(5);
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
      // The rows come back: the header shows again and the box scrolls sideways.
      rerender(<DataTable {...base} rows={rows} />);
      expect(screen.getByRole('table')).not.toHaveAttribute('data-headless');
      expect(screen.getByRole('region')).toHaveAttribute('tabindex', '0');
    });
  });

  it('keeps its roles while it stacks and shows a message', () => {
    const { container } = render(<DataTable {...base} rows={[]} status="loading" stackBelow="phone" />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('table')).toHaveAttribute('role', 'table');
    expect(container.querySelector('[data-component="DataTable"] > [tabindex="-1"]')).toHaveTextContent('Đang tải danh sách…');
  });
});
