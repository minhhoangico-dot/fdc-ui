import type { Meta, StoryObj } from '@storybook/react';
import { makeRecords, type KskRecord } from '../../../fixtures/ksk';
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

/** Long names and companies wrap; codes and statuses stay on one line; a record open elsewhere says so. */
export const Records: Story = {};

export const Loading: Story = { args: { rows: [], status: 'loading' } };

/** The network failed: say what, keep the header, offer "Tải lại". */
export const NetworkError: Story = {
  args: { rows: [], status: 'error', errorText: 'Không tải được danh sách: mất mạng. Kiểm tra wifi rồi bấm Tải lại.', onRetry: () => {} },
};

/** No match for the search: say why and how to get back. */
export const NoMatch: Story = {
  args: { rows: [], emptyText: 'Không có ai khớp “Hằng” trong nhóm Cần điền hoặc sửa. Xóa chữ tìm hoặc chọn nhóm Tất cả.' },
};

/** On a phone the table scrolls sideways inside its box; the page itself never does. */
export const Phone: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
