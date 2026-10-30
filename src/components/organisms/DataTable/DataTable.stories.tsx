import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { StatusTag } from '../../atoms/StatusTag';
import { labResults, makeRecords, type KskRecord } from '../../../fixtures/ksk';
import { recordColumns } from '../../../fixtures/kskTable';
import { DataTable } from './DataTable';

const rows = makeRecords(10);

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable<KskRecord>,
  parameters: { density: 'compact', layout: 'padded' },
  args: {
    caption: 'Người trong đợt Rạng Đông KSK 2026',
    columns: recordColumns,
    rows,
    getRowKey: (r: KskRecord) => r.recordCode,
    pagination: { page: 1, pageSize: 10, total: 2033, itemLabel: 'người', getHref: (p: number) => `#trang-${p}` },
  },
} satisfies Meta<typeof DataTable<KskRecord>>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Long names wrap; codes and state tags stay on one line; a record open elsewhere says so. Every column but the last
 * has a width, so no column moves when the rows change. Without stackBelow, a narrow screen scrolls the table
 * sideways inside its box; the page itself never does.
 */
export const Records: Story = {};

export const Loading: Story = { args: { rows: [], status: 'loading' } };

/**
 * The network failed: the "!" sign and what failed, under the header and outside the sideways scroll, so the words
 * and "Tải lại" are on screen at every width. "Tải lại" here loads the rows.
 */
export const NetworkError: Story = {
  args: { rows: [], status: 'error', errorText: 'Không tải được danh sách: mất mạng. Kiểm tra wifi rồi bấm Tải lại.' },
  render: function Render(args) {
    const [failed, setFailed] = useState(true);
    return <DataTable {...args} rows={failed ? [] : rows} status={failed ? 'error' : 'ready'} onRetry={() => setFailed(false)} />;
  },
};

/** After "Tải lại": the button goes with the error, so focus moves to the first row's link, and the live region says the count. */
export const AfterRetry: Story = {
  ...NetworkError,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const live = canvas.getByRole('status');
    await waitFor(() => expect(live).toHaveTextContent('mất mạng'));
    await userEvent.click(canvas.getByRole('button', { name: 'Tải lại' }));
    await expect(canvas.getByRole('link', { name: rows[0].name })).toHaveFocus();
    await waitFor(() => expect(live).toHaveTextContent('Người trong đợt Rạng Đông KSK 2026: hiển thị 1–10 trong 2.033 người.'));
  },
};

/** No match for the search: say why and how to get back; the live region says the same words. */
export const NoMatch: Story = {
  args: { rows: [], emptyText: 'Không có ai khớp “Hằng” trong nhóm Cần điền hoặc sửa. Xóa chữ tìm hoặc chọn nhóm Tất cả.' },
};

/**
 * stackBelow="phone": below 40rem each record is a block, the name first (the whole name area opens the record),
 * then one line per column with its name. The state tag has no label but stays in the value column, lined up with
 * the other values. The first screen shows records, and nothing scrolls sideways.
 */
export const Phone: Story = {
  args: { stackBelow: 'phone' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

type Lab = (typeof labResults)[number];

/**
 * variant="plain": a table inside a card (here a SummaryList's details on the review page). No outer edge and no
 * header band, only rows and dividers, and the text lines up with the card's own text: no box inside a box.
 */
export const Plain: StoryObj<typeof DataTable<Lab>> = {
  render: () => (
    <section style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-15) var(--space-20)', background: 'var(--surface)' }}>
      <p style={{ margin: '0 0 var(--space-10)', fontWeight: 600 }}>6. Cận lâm sàng</p>
      <DataTable
        variant="plain"
        caption="Kết quả cận lâm sàng"
        minWidth="30rem"
        stackBelow="phone"
        rows={labResults.slice(0, 6).concat(labResults.slice(-1))}
        getRowKey={(r) => r.name}
        columns={[
          { key: 'name', header: 'Chỉ số', rowHeader: true, cell: (r) => r.name },
          {
            key: 'value',
            header: 'Kết quả',
            align: 'end',
            cell: (r) => (
              <>
                {r.value}
                {r.unit ? ` ${r.unit}` : ''}
                {r.flag ? (
                  <>
                    {' '}
                    <StatusTag tone="attention" size="sm">
                      {r.flag}
                    </StatusTag>
                  </>
                ) : null}
              </>
            ),
          },
          {
            key: 'source',
            header: 'Nguồn',
            nowrap: true,
            width: '10rem',
            cell: (r) =>
              r.source === 'HIS' ? (
                'HIS'
              ) : (
                <>
                  <StatusTag tone="muted" size="sm">
                    Nhập tay
                  </StatusTag>{' '}
                  {r.by}
                </>
              ),
          },
        ]}
      />
    </section>
  ),
};
