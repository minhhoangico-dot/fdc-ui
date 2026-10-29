import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { StatusTag } from '../components/atoms/StatusTag';
import { TextField } from '../components/atoms/TextField';
import { Inline } from '../components/layout/Inline';
import { Breadcrumb } from '../components/molecules/Breadcrumb';
import { RadioGroup } from '../components/molecules/RadioGroup';
import { DataTable } from '../components/organisms/DataTable';
import { StaffLayout } from '../components/templates/StaffLayout';
import { recordGroups, records as allRecords, type KskRecord } from '../fixtures/ksk';
import { recordColumns } from '../fixtures/kskTable';
import { staffHeader } from '../fixtures/staff';
import { foldVi, formatViInteger } from '../utils/vi';

const PAGE_SIZE = 50;

type ListProps = {
  records?: KskRecord[];
  initialGroup?: string;
  initialQuery?: string;
  /** The first load fails (network); "Tải lại" then succeeds. */
  failFirstLoad?: boolean;
  loading?: boolean;
};

function RecordList({ records = allRecords, initialGroup = 'can-lam', initialQuery = '', failFirstLoad, loading }: ListProps) {
  const [group, setGroup] = useState(initialGroup);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [failed, setFailed] = useState(Boolean(failFirstLoad));

  const counts = useMemo(
    () =>
      Object.fromEntries(
        recordGroups.map((g) => [g.value, g.statuses.length ? records.filter((r) => g.statuses.includes(r.status)).length : records.length]),
      ),
    [records],
  );
  const groupDef = recordGroups.find((g) => g.value === group)!;
  const q = foldVi(query);
  const rows = records.filter(
    (r) =>
      (!groupDef.statuses.length || groupDef.statuses.includes(r.status)) &&
      (!q || foldVi(`${r.stt} ${r.recordCode} ${r.name} ${r.idEnd ?? ''}`).includes(q)),
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const sent = records.filter((r) => r.status === 'Đã gửi lên Sở').length;
  const now = counts['can-lam'] + counts['xem-lai'];

  return (
    <StaffLayout header={staffHeader}>
      <Breadcrumb items={[{ label: 'Việc của tôi', href: '#' }, { label: 'Rạng Đông KSK 2026' }]} />
      <Inline justify="between" align="center" gap={15}>
        <Inline align="center" gap={10}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '2rem', lineHeight: 1.3 }}>Rạng Đông KSK 2026</h1>
          <StatusTag tone="muted">Điền thông tin · Minh gửi</StatusTag>
        </Inline>
        <Inline gap={10}>
          <Button>Lấy kết quả xét nghiệm cả đợt</Button>
          <Button variant="primary" href="#lam-tiep">
            Làm tiếp
          </Button>
        </Inline>
      </Inline>

      <p style={{ margin: 0 }}>
        <strong>{formatViInteger(records.length)}</strong> người · <strong>{formatViInteger(now)}</strong> làm được ngay ·{' '}
        <span style={{ color: 'var(--text-muted)' }}>{formatViInteger(counts['dang-cho'])} đang chờ HIS hoặc Minh</span> ·{' '}
        <strong>{formatViInteger(sent)}</strong> đã gửi lên Sở
      </p>

      <section
        aria-label="Lọc danh sách"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-15)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-15)' }}
      >
        <RadioGroup
          label="Nhóm người"
          name="nhom"
          layout="wrap"
          density="compact"
          value={group}
          onValueChange={(v) => {
            setGroup(v);
            setPage(1);
          }}
          options={recordGroups.map((g) => ({ value: g.value, label: `${g.label} · ${formatViInteger(counts[g.value])}` }))}
        />
        <div style={{ maxWidth: '36rem' }}>
          <TextField
            label="Tìm người"
            type="search"
            hint="STT, mã lượt khám, tên hoặc 4 số cuối CCCD. Gõ không dấu cũng được."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </section>

      <DataTable
        caption={`${groupDef.label}${query ? `, khớp “${query}”` : ''}`}
        columns={recordColumns}
        rows={shown}
        getRowKey={(r) => r.recordCode}
        status={loading ? 'loading' : failed ? 'error' : 'ready'}
        errorText="Không tải được danh sách: mất mạng. Kiểm tra wifi rồi bấm Tải lại; chữ tìm và nhóm đang chọn vẫn giữ."
        onRetry={() => setFailed(false)}
        emptyText={
          query
            ? `Không có ai khớp “${query}” trong nhóm ${groupDef.label}. Xóa chữ tìm hoặc chọn nhóm Tất cả.`
            : `Nhóm ${groupDef.label} đang trống.`
        }
        pagination={{ page: current, pageSize: PAGE_SIZE, total: rows.length, itemLabel: 'người', onPageChange: setPage }}
      />
    </StaffLayout>
  );
}

const meta = {
  title: 'Pages/Nhân viên/Danh sách hồ sơ',
  component: RecordList,
  parameters: { layout: 'fullscreen', density: 'compact' },
} satisfies Meta<typeof RecordList>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The working list: people to fill in or fix, 50 a page, with long names, a missing ID and a record open elsewhere. */
export const CanLam: Story = {};

/** All 2.033 people: 41 pages; "Sau ›" moves on and the range is announced. */
export const TatCa: Story = {
  args: { initialGroup: 'tat-ca' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Trang của danh sách' });
    await expect(nav).toHaveTextContent('Hiển thị 1–50 trong 2.033 người');
    await userEvent.click(within(nav).getByRole('button', { name: 'Sau ›' }));
    await expect(nav).toHaveTextContent('Hiển thị 51–100 trong 2.033 người');
  },
};

/** Typed without tone marks: "ton nu" finds Tôn Nữ Hoàng Bảo Ngọc Phương Thảo. */
export const TimKhongDau: Story = { args: { initialQuery: 'ton nu' } };

/** No match: the table says why and how to get back. */
export const KhongKhop: Story = { args: { initialQuery: 'Hằng Nga' } };

export const DangTai: Story = { args: { loading: true } };

/** The list did not load: say what failed, keep the filters, "Tải lại". */
export const MatMang: Story = {
  args: { failFirstLoad: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('mất mạng');
  },
};

export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
